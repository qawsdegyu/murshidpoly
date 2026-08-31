import json
from pathlib import Path
from collections import Counter
rows=[json.loads(line) for line in Path('/home/ubuntu/murshidpoly/drive_knowledge_manifest.jsonl').read_text().splitlines()]
counts=Counter(r['mimeType'] for r in rows)
size=sum(r.get('size',0) for r in rows)
print(json.dumps({'files':len(rows),'metadata_bytes':size,'metadata_gib':round(size/1024**3,2),'by_mime':counts},ensure_ascii=False))
