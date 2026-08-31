import json,hashlib
from pathlib import Path

def q(s): return "'"+str(s).replace("'","''")+"'"
mapping=json.loads(Path('.tmp_chemical_tbt_sync_mapping.json').read_text(encoding='utf-8'))
folder='https://drive.google.com/drive/folders/1leY6GZeC1khjIWFVh2wbBykRENoZbM4w'
seen=set(); lines=['begin;']
for x in mapping:
 cid=x['course_id']
 if cid in seen: continue
 seen.add(cid)
 rid='chem_tbt_archive_'+hashlib.sha1(cid.encode()).hexdigest()[:20]
 title='أرشيف Chemical TBT — '+x['source_name']
 lines.append(f"insert into public.resources (id,course_id,title,type,uploader,size,url) select {q(rid)},{q(cid)},{q(title)},{q('summary')},{q('Chemical TBT')},null,{q(folder)} where not exists (select 1 from public.resources where course_id={q(cid)} and url={q(folder)});")
lines.append('commit;')
Path('.tmp_chemical_archive_resource.sql').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print({'courses':len(seen),'sql_lines':len(lines)})
