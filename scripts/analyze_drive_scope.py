import json
from pathlib import Path
from collections import Counter
items=[]
for line in Path('/home/ubuntu/murshidpoly/drive_inventory.ndjson').read_text().splitlines():
    try: items.extend(json.loads(line).get('files', []))
    except: pass
by_id={x['id']:x for x in items}
root=next((x for x in items if x.get('name')=='04 - مصادر المساعد الذكي'), None)
if not root: raise SystemExit('root not found')
children={}
for x in items:
    for p in x.get('parents',[]): children.setdefault(p,[]).append(x)
seen=set(); stack=[root['id']]; scoped=[]
while stack:
    parent=stack.pop()
    if parent in seen: continue
    seen.add(parent)
    for x in children.get(parent,[]):
        scoped.append(x)
        if x.get('mimeType')=='application/vnd.google-apps.folder': stack.append(x['id'])
print('assistant_root', root['id'])
print('descendants', len(scoped))
for mime,count in Counter(x.get('mimeType','unknown') for x in scoped).most_common(): print(mime, count)
print('folders', sum(1 for x in scoped if x.get('mimeType')=='application/vnd.google-apps.folder'))
for x in scoped:
    if x.get('mimeType')!='application/vnd.google-apps.folder': print(x.get('id'), x.get('mimeType'), x.get('name'))
