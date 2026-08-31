ALTER TABLE public.chatbot_knowledge_sources
  ADD COLUMN IF NOT EXISTS drive_file_id TEXT,
  ADD COLUMN IF NOT EXISTS drive_modified_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS drive_path TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS chatbot_knowledge_sources_drive_file_uidx
  ON public.chatbot_knowledge_sources (drive_file_id)
  WHERE drive_file_id IS NOT NULL;

COMMENT ON COLUMN public.chatbot_knowledge_sources.drive_file_id IS 'Google Drive file ID used for idempotent imports';
