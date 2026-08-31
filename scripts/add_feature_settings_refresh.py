from pathlib import Path

for name in ['MurshidAssistant.tsx', 'KnowledgeAssistant.tsx']:
    path = Path('/home/ubuntu/murshidpoly/src/components') / name
    text = path.read_text()
    old = '''  useEffect(() => {
    let cancelled = false;
    (async () => {'''
    new = '''  useEffect(() => {
    let cancelled = false;
    const checkAssistantAccess = async () => {'''
    if old not in text:
        raise SystemExit(f'anchor start not found: {name}')
    text = text.replace(old, new, 1)
    old_end = '''    })();
    return () => { cancelled = true; };
  }, [user]);'''
    new_end = '''    };
    const refresh = () => { void checkAssistantAccess(); };
    void checkAssistantAccess();
    window.addEventListener("site-settings-updated", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("site-settings-updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [user]);'''
    if old_end not in text:
        raise SystemExit(f'anchor end not found: {name}')
    path.write_text(text.replace(old_end, new_end, 1))
print('patched')
