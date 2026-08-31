import json,time,re
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup
urls=['https://civilteam.wixsite.com/civil-team/post/'+x.strip().rsplit('/',1)[-1] for x in Path('.tmp_civil_team_material_urls.txt').read_text().splitlines() if x.strip()]
rows=[]
for i,u in enumerate(urls,1):
 try:
  r=requests.get(u,timeout=30,headers={'User-Agent':'Mozilla/5.0'}); s=BeautifulSoup(r.text,'html.parser')
  for x in s(['script','style','noscript']): x.decompose()
  text=' '.join(s.get_text(' ',strip=True).split())
  links=[]
  for a in s.find_all('a',href=True):
   h=urljoin(u,a['href'])
   if h.startswith(('http://','https://')) and h not in links: links.append(h)
  rows.append({'url':u,'slug':u.rsplit('/',1)[-1],'status':r.status_code,'title':s.title.get_text(' ',strip=True) if s.title else '','text':text,'links':links})
  print(f'{i}/{len(urls)} {r.status_code} {u}',flush=True)
 except Exception as e:
  rows.append({'url':u,'slug':u.rsplit('/',1)[-1],'error':str(e)}); print(f'{i}/{len(urls)} ERROR {u} {e}',flush=True)
 time.sleep(.1)
Path('.tmp_civil_team_posts.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'posts':len(rows),'with_links':sum(bool(x.get('links')) for x in rows),'links':sum(len(x.get('links',[])) for x in rows)},ensure_ascii=False))
