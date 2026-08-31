import json,re
from pathlib import Path
rows=json.loads(Path('.tmp_chemical_tbt_material_pages.json').read_text(encoding='utf-8'))
out=[]
for r in rows:
    links=[u for u in r.get('links',[]) if 'weebly.com' not in u and 'editmysite.com' not in u and 'weebly.com' not in u]
    out.append({'page_number':r.get('page_number'),'page_url':r.get('page_url'),'title':r.get('title'),'text':r.get('text'),'external_links':links,'images':r.get('images',[])})
Path('.tmp_chemical_tbt_catalog.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':len(out),'external_link_pages':sum(bool(x['external_links']) for x in out),'external_links':sum(len(x['external_links']) for x in out),'sample':out[:3]},ensure_ascii=False))
