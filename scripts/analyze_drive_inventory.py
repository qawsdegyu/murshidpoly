import json
from pathlib import Path
from collections import Counter
raw = Path('/home/ubuntu/murshidpoly/drive_inventory.ndjson').read_text().splitlines()
items=[]
for line in raw:
    try:
        obj=json.loads(line)
        items.extend(obj.get('files', []))
    except json.JSONDecodeError:
        pass
counts=Counter(x.get('mimeType','unknown') for x in items)
folders=[x for x in items if x.get('mimeType')=='application/vnd.google-apps.folder']
print('items', len(items))
print('folders', len(folders))
for mime,count in counts.most_common(): print(mime, count)
print('nonfolders', len(items)-len(folders))
print('last names', [x.get('name') for x in items[-10:]])
