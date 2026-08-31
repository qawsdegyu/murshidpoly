import json
from pathlib import Path
from collections import Counter

INVENTORY = Path('/home/ubuntu/murshidpoly/drive_inventory.ndjson')
OUT = Path('/home/ubuntu/murshidpoly/drive_knowledge_manifest.jsonl')
TEXT_MIMES = {
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'text/plain', 'text/html', 'application/json', 'text/x-sql',
    'application/vnd.google-apps.document',
}
FOLDER = 'application/vnd.google-apps.folder'
items = []
for line in INVENTORY.read_text().splitlines():
    try:
        items.extend(json.loads(line).get('files', []))
    except json.JSONDecodeError:
        continue
by_id = {item['id']: item for item in items}
parent_map = {item['id']: (item.get('parents') or []) for item in items}

def path_for(item):
    names = []
    seen = set()
    current = item
    while current and current.get('id') not in seen:
        seen.add(current.get('id'))
        names.append(current.get('name', ''))
        parents = parent_map.get(current.get('id'), [])
        current = by_id.get(parents[0]) if parents else None
    return list(reversed([name for name in names if name]))

count = Counter()
written = 0
with OUT.open('w', encoding='utf-8') as output:
    for item in items:
        mime = item.get('mimeType', '')
        if mime == FOLDER or mime not in TEXT_MIMES:
            continue
        path = path_for(item)
        record = {
            'id': item.get('id'), 'name': item.get('name'), 'mimeType': mime,
            'size': int(item.get('size') or 0), 'modifiedTime': item.get('modifiedTime'),
            'webViewLink': item.get('webViewLink'), 'path': path,
            'path_text': ' / '.join(path),
        }
        output.write(json.dumps(record, ensure_ascii=False) + '\n')
        count[mime] += 1
        written += 1
print(json.dumps({'inventory_items': len(items), 'manifest_items': written, 'by_mime': count}, ensure_ascii=False))
