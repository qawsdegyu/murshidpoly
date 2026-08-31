import json,re
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin
lib=BeautifulSoup(Path('.tmp_chemical_tbt_library.html').read_text(encoding='utf-8',errors='ignore'),'html.parser')
pages=json.loads(Path('.tmp_chemical_tbt_catalog.json').read_text(encoding='utf-8'))
byurl={x['page_url'].replace('https://','http://'):x for x in pages}
rows=[]
for area in lib.find_all('area',href=True):
    u=urljoin('http://chemicaltbt.weebly.com/',area['href'])
    if not re.fullmatch(r'http://chemicaltbt\.weebly\.com/\d+\.html',u): continue
    p=byurl.get(u)
    if not p: continue
    rows.append({'name':(area.get('title') or '').strip(),'page_url':u,'page_number':u.rsplit('/',1)[-1].split('.')[0],'links':p.get('external_links',[]),'text':p.get('text','')})
seen={}
out=[]
for x in rows:
    k=(x['page_number'],x['name'])
    if k not in seen: seen[k]=1; out.append(x)
Path('.tmp_chemical_tbt_index.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'subjects':len(out),'with_external_links':sum(bool(x['links']) for x in out),'external_links':sum(len(x['links']) for x in out),'names':[x['name'] for x in out]},ensure_ascii=False))
