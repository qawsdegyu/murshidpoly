import json
from pathlib import Path
rows=json.loads(Path('.tmp_civil_team_posts.json').read_text(encoding='utf-8'))
out=[]
for x in rows:
 if x.get('status')!=200 or x.get('title')=='Post | civil-team': continue
 links=[u for u in x.get('links',[]) if not any(k in u for k in ('facebook.com','twitter.com','wix.com/lpviral','civilteam.wixsite.com'))]
 out.append({'name':x['title'].split(' | ')[0].strip(),'source_page':x['url'],'links':list(dict.fromkeys(links))})
Path('.tmp_civil_team_catalog_manifest.json').write_text(json.dumps({'source':'https://civilteam.wixsite.com/civil-team/civilbooks','materials':out},ensure_ascii=False,indent=2),encoding='utf-8')
print({'materials':len(out),'links':sum(len(x['links']) for x in out)})
