import argparse
import json
import os
import re
import subprocess
import tempfile
import time
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

import requests

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'drive_knowledge_manifest.jsonl'
TEXT_MIMES = {
    'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint',
    'application/msword', 'text/plain', 'text/html', 'application/json', 'text/x-sql',
    'application/vnd.google-apps.document',
}

def run_gws(args, output=None):
    cmd = ['gws', *args]
    cwd = None
    if output:
        output = Path(output)
        cwd = str(output.parent)
        cmd += ['--output', output.name]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    if result.returncode:
        raise RuntimeError((result.stderr or result.stdout)[-800:])
    if output and not output.exists() and result.stdout:
        output.write_text(result.stdout, encoding='utf-8')
    return result.stdout

def extract_zip_xml(path, tags):
    chunks=[]
    with zipfile.ZipFile(path) as z:
        for name in z.namelist():
            if not name.endswith('.xml'): continue
            try:
                root=ET.fromstring(z.read(name))
            except Exception: continue
            for node in root.iter():
                if node.tag.split('}')[-1] in tags and node.text:
                    chunks.append(node.text)
    return ' '.join(chunks)

def extract_file(path, mime, name):
    if mime == 'application/pdf':
        out = path.with_suffix('.txt')
        result=subprocess.run(['pdftotext','-layout',str(path),str(out)], capture_output=True, text=True)
        if result.returncode: return ''
        return out.read_text(errors='ignore') if out.exists() else ''
    if mime == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return extract_zip_xml(path, {'t'})
    if mime == 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return extract_zip_xml(path, {'t'})
    if mime == 'application/msword':
        return subprocess.run(['catdoc', str(path)], capture_output=True, text=True).stdout
    if mime == 'application/vnd.ms-powerpoint':
        return subprocess.run(['catppt', str(path)], capture_output=True, text=True).stdout
    if mime == 'application/vnd.google-apps.document':
        out=path.with_suffix('.txt')
        run_gws(['drive','files','export','--params',json.dumps({'fileId':name,'mimeType':'text/plain'})], out)
        return out.read_text(errors='ignore') if out.exists() else ''
    return path.read_text(errors='ignore')

def clean(text):
    text=text.replace('\x00',' ')
    text=re.sub(r'\r\n?', '\n', text)
    text=re.sub(r'[ \t]+', ' ', text)
    text=re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def chunks(text, size=6000, overlap=400):
    if len(text) <= size: return [text]
    out=[]; start=0
    while start < len(text):
        end=min(len(text),start+size)
        piece=text[start:end]
        if end < len(text):
            cut=max(piece.rfind('\n\n'), piece.rfind('. '), piece.rfind(' '))
            if cut > size//2: end=start+cut
        out.append(text[start:end].strip())
        if end >= len(text): break
        start=max(end-overlap,start+1)
    return [x for x in out if x]

def normalize(text):
    return re.sub(r'\s+', ' ', text).lower().strip()

def api_headers(key):
    return {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type':'application/json', 'Prefer':'resolution=merge-duplicates,return=representation'}

def infer_course(path_text, name, courses):
    hay=(path_text+' '+name).lower()
    best=None; best_score=0
    for c in courses:
        tokens=[t for t in re.split(r'\W+', str(c.get('name_ar') or '')+' '+str(c.get('name_en') or '')+' '+str(c.get('code') or '')) if len(t)>2]
        score=sum(1 for t in tokens if t.lower() in hay)
        if score>best_score: best,best_score=c,score
    return best['id'] if best_score else None

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--max-files',type=int); ap.add_argument('--start',type=int,default=0); ap.add_argument('--sleep',type=float,default=.15); args=ap.parse_args()
    url=os.environ['SUPABASE_URL'].rstrip('/')
    key=os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or Path('/tmp/supabase_service_key').read_text().strip()
    headers=api_headers(key)
    rows=[json.loads(x) for x in MANIFEST.read_text().splitlines() if x.strip()]
    course_response=requests.get(f'{url}/rest/v1/courses',params={'select':'id,code,name_ar,name_en','limit':'1000'},headers=headers,timeout=30)
    course_data=course_response.json()
    courses=course_data if isinstance(course_data, list) else []
    rows=rows[args.start: args.start+args.max_files if args.max_files else None]
    report={'attempted':0,'imported':0,'skipped_empty':0,'failed':0,'errors':[],'chars':0,'chunks':0}
    with tempfile.TemporaryDirectory(prefix='murshid-drive-') as tmp:
        tmp=Path(tmp)
        for row in rows:
            report['attempted']+=1; fid=row['id']; raw=tmp/f'{fid}.bin'
            try:
                if row['mimeType']=='application/vnd.google-apps.document':
                    run_gws(['drive','files','export','--params',json.dumps({'fileId':fid,'mimeType':'text/plain'})], raw)
                else:
                    run_gws(['drive','files','get','--params',json.dumps({'fileId':fid,'alt':'media'})], raw)
                text=clean(extract_file(raw,row['mimeType'],fid))
                if not text:
                    report['skipped_empty']+=1; continue
                course_id=infer_course(row.get('path_text',''),row.get('name',''),courses)
                payload={'title':row['name'],'file_name':row['name'],'content':text,'normalized_content':normalize(text),'file_url':row.get('webViewLink'),'mime_type':row['mimeType'],'source_type':'google_drive','course_id':course_id,'drive_file_id':fid,'drive_modified_time':row.get('modifiedTime'),'drive_path':row.get('path_text'),'processing_status':'ready','processing_error':None,'character_count':len(text),'chunk_count':len(chunks(text)),'processed_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
                existing=requests.get(f'{url}/rest/v1/chatbot_knowledge_sources',headers=headers,params={'select':'id','drive_file_id':f'eq.{fid}','limit':'1'},timeout=30)
                if existing.status_code not in (200,206): raise RuntimeError(f'lookup {existing.status_code}: {existing.text[:400]}')
                existing_rows=existing.json()
                if existing_rows:
                    sid=existing_rows[0]['id']
                    response=requests.patch(f'{url}/rest/v1/chatbot_knowledge_sources',headers=headers,params={'id':f'eq.{sid}'},json=payload,timeout=60)
                else:
                    response=requests.post(f'{url}/rest/v1/chatbot_knowledge_sources',headers=headers,json=payload,timeout=60)
                    if response.status_code in (200,201): sid=response.json()[0]['id']
                if response.status_code not in (200,201,204): raise RuntimeError(f'source {response.status_code}: {response.text[:400]}')
                pieces=chunks(text)
                requests.delete(f'{url}/rest/v1/chatbot_knowledge_chunks',headers=headers,params={'source_id':f'eq.{sid}'},timeout=30)
                chunk_rows=[{'source_id':sid,'chunk_index':i,'content':p,'normalized_content':normalize(p),'token_count':max(1,len(p)//4),'is_active':True} for i,p in enumerate(pieces)]
                for pos in range(0,len(chunk_rows),100):
                    cr=requests.post(f'{url}/rest/v1/chatbot_knowledge_chunks',headers=headers,json=chunk_rows[pos:pos+100],timeout=60)
                    if cr.status_code not in (200,201): raise RuntimeError(f'chunk {cr.status_code}: {cr.text[:400]}')
                report['imported']+=1; report['chars']+=len(text); report['chunks']+=len(pieces)
                print(json.dumps({'ok':True,'id':fid,'name':row['name'],'chars':len(text),'chunks':len(pieces)},ensure_ascii=False),flush=True)
            except Exception as exc:
                report['failed']+=1; report['errors'].append({'id':fid,'name':row.get('name'),'error':str(exc)[:500]})
                print(json.dumps({'ok':False,'id':fid,'name':row.get('name'),'error':str(exc)[:500]},ensure_ascii=False),flush=True)
            time.sleep(args.sleep)
    print('REPORT '+json.dumps(report,ensure_ascii=False))

if __name__=='__main__': main()
