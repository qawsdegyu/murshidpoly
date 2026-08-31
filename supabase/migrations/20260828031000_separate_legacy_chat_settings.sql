insert into public.site_settings (key, value, is_public)
values
  ('knowledge_assistant_enabled', 'true', true),
  ('knowledge_assistant_access_mode', 'all', true),
  ('knowledge_assistant_allowed_emails', '', true),
  ('knowledge_assistant_allowed_majors', '', true)
on conflict (key) do nothing;
