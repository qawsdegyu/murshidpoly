CREATE TABLE IF NOT EXISTS public.chatbot_knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  storage_path TEXT,
  mime_type TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chatbot_knowledge_sources_active_idx
  ON public.chatbot_knowledge_sources (is_active, updated_at DESC);

ALTER TABLE public.chatbot_knowledge_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_chatbot_sources" ON public.chatbot_knowledge_sources;
CREATE POLICY "public_read_active_chatbot_sources"
  ON public.chatbot_knowledge_sources
  FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "admin_manage_chatbot_sources" ON public.chatbot_knowledge_sources;
CREATE POLICY "admin_manage_chatbot_sources"
  ON public.chatbot_knowledge_sources
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.touch_chatbot_knowledge_source()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS chatbot_knowledge_sources_touch ON public.chatbot_knowledge_sources;
CREATE TRIGGER chatbot_knowledge_sources_touch
  BEFORE UPDATE ON public.chatbot_knowledge_sources
  FOR EACH ROW EXECUTE FUNCTION public.touch_chatbot_knowledge_source();
