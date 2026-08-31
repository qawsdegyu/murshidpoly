from pathlib import Path

# New knowledge assistant uses its own setting namespace.
for name in ['FeatureGate.tsx', 'KnowledgeAssistant.tsx']:
    path = Path('/home/ubuntu/murshidpoly/src/components') / name
    s = path.read_text()
    s = s.replace('ai_assistant_enabled', 'knowledge_assistant_enabled')
    s = s.replace('ai_assistant_access_mode', 'knowledge_assistant_access_mode')
    s = s.replace('ai_assistant_allowed_emails', 'knowledge_assistant_allowed_emails')
    s = s.replace('ai_assistant_allowed_majors', 'knowledge_assistant_allowed_majors')
    path.write_text(s)

path = Path('/home/ubuntu/murshidpoly/src/hooks/useSiteSettings.ts')
s = path.read_text()
s = s.replace("ai_assistant_enabled: 'true'", "knowledge_assistant_enabled: 'true'")
s = s.replace("ai_assistant_access_mode: 'all'", "knowledge_assistant_access_mode: 'all'")
path.write_text(s)

# The legacy floating chatbot is intentionally always available.
path = Path('/home/ubuntu/murshidpoly/src/components/MurshidAssistant.tsx')
s = path.read_text()
start = s.index('  useEffect(() => {\n    let cancelled = false;\n    const checkAssistantAccess = async () => {')
end = s.index('  useEffect(() => {', start + 10)
s = s[:start] + s[end:]
s = s.replace('  if (!assistantAllowed) return null;\n\n', '')
path.write_text(s)

# Admin labels/settings now refer only to the new knowledge assistant.
path = Path('/home/ubuntu/murshidpoly/src/components/SiteSettingsManager.tsx')
s = path.read_text()
s = s.replace("key: 'ai_assistant_enabled', label: 'مساعد مُرشد الذكي'", "key: 'knowledge_assistant_enabled', label: 'مساعد مُرشد الذكي الجديد'")
s = s.replace("key: 'ai_assistant_access_mode'", "key: 'knowledge_assistant_access_mode'")
s = s.replace("key: 'ai_assistant_allowed_emails'", "key: 'knowledge_assistant_allowed_emails'")
s = s.replace("key: 'ai_assistant_allowed_majors'", "key: 'knowledge_assistant_allowed_majors'")
path.write_text(s)
print('patched')
