import json, re, time
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

base='https://chemicaltbt.weebly.com/'
html=Path('.tmp_chemical_tbt_library.html').read_text(encoding='utf-8', errors='ignore')
soup=BeautifulSoup(html,'html.parser')
urls=[]
for a in soup.find_all(['a', 'area'], href=True):
    u=urljoin(base,a['href'])
    if re.fullmatch(r'https?://chemicaltbt\.weebly\.com/\d+\.html',u) and u not in urls:
        urls.append(u)
rows=[]
for i,u in enumerate(urls,1):
    try:
        r=requests.get(u,timeout=25,headers={'User-Agent':'Mozilla/5.0'})
        s=BeautifulSoup(r.text,'html.parser')
        for x in s(['script','style','noscript']): x.decompose()
        text=' '.join(s.get_text(' ',strip=True).split())
        links=[]
        for a in s.find_all(['a', 'area'],href=True):
            href=urljoin(u,a['href'])
            if href.startswith(('http://','https://')) and href not in links:
                links.append(href)
        images=[]
        for img in s.find_all('img',src=True):
            images.append(urljoin(u,img['src']))
        rows.append({'page_url':u,'page_number':u.rsplit('/',1)[-1].split('.')[0],'status':r.status_code,'title':s.title.get_text(' ',strip=True) if s.title else '','text':text,'links':links,'images':images})
        print(f'{i}/{len(urls)} {u} {r.status_code}', flush=True)
    except Exception as e:
        rows.append({'page_url':u,'page_number':u.rsplit('/',1)[-1].split('.')[0],'error':str(e)})
        print(f'{i}/{len(urls)} ERROR {u} {e}', flush=True)
    time.sleep(.1)
Path('.tmp_chemical_tbt_material_pages.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':len(rows),'with_links':sum(bool(x.get('links')) for x in rows),'with_images':sum(bool(x.get('images')) for x in rows)},ensure_ascii=False))
