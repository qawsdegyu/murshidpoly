ALTER TABLE public.chatbot_knowledge_sources
  ADD COLUMN IF NOT EXISTS normalized_content TEXT,
  ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'upload',
  ADD COLUMN IF NOT EXISTS course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS major_key TEXT,
  ADD COLUMN IF NOT EXISTS processing_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS processing_error TEXT,
  ADD COLUMN IF NOT EXISTS character_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS chunk_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source_hash TEXT,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS chatbot_knowledge_sources_course_idx
  ON public.chatbot_knowledge_sources (course_id, is_active, updated_at DESC);

CREATE INDEX IF NOT EXISTS chatbot_knowledge_sources_major_idx
  ON public.chatbot_knowledge_sources (major_key, is_active, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.chatbot_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.chatbot_knowledge_sources(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  normalized_content TEXT NOT NULL,
  token_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS chatbot_knowledge_chunks_search_idx
  ON public.chatbot_knowledge_chunks (is_active, source_id, chunk_index);

ALTER TABLE public.chatbot_knowledge_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_chatbot_chunks" ON public.chatbot_knowledge_chunks;
CREATE POLICY "public_read_active_chatbot_chunks"
  ON public.chatbot_knowledge_chunks FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "admin_manage_chatbot_chunks" ON public.chatbot_knowledge_chunks;
CREATE POLICY "admin_manage_chatbot_chunks"
  ON public.chatbot_knowledge_chunks FOR ALL TO authenticated
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

UPDATE public.chatbot_knowledge_sources
SET processing_status = CASE WHEN content IS NULL OR btrim(content) = '' THEN 'failed' ELSE 'ready' END,
    normalized_content = lower(regexp_replace(content, '\s+', ' ', 'g')),
    character_count = char_length(content),
    processed_at = CASE WHEN content IS NULL OR btrim(content) = '' THEN NULL ELSE COALESCE(processed_at, NOW()) END
WHERE processing_status = 'pending';

INSERT INTO public.chatbot_knowledge_chunks (source_id, chunk_index, content, normalized_content, token_count)
SELECT id, 0, content, lower(regexp_replace(content, '\s+', ' ', 'g')), GREATEST(1, ceil(char_length(content) / 4.0)::integer)
FROM public.chatbot_knowledge_sources s
WHERE s.content IS NOT NULL AND btrim(s.content) <> ''
  AND NOT EXISTS (SELECT 1 FROM public.chatbot_knowledge_chunks c WHERE c.source_id = s.id)
LIMIT 1000;

UPDATE public.chatbot_knowledge_sources s
SET chunk_count = (SELECT count(*) FROM public.chatbot_knowledge_chunks c WHERE c.source_id = s.id)
WHERE EXISTS (SELECT 1 FROM public.chatbot_knowledge_chunks c WHERE c.source_id = s.id);

COMMENT ON TABLE public.chatbot_knowledge_chunks IS 'AI-friendly searchable passages generated from uploaded knowledge sources';
COMMENT ON COLUMN public.chatbot_knowledge_sources.processing_status IS 'pending, processing, ready, or failed';
COMMENT ON COLUMN public.chatbot_knowledge_sources.course_id IS 'Optional material id used for course-aware retrieval';
COMMENT ON COLUMN public.chatbot_knowledge_sources.major_key IS 'Optional normalized major id used for access-aware retrieval';

-- Keep anonymous/public reads limited to active, successfully processed knowledge.
DROP POLICY IF EXISTS "public_read_active_chatbot_sources" ON public.chatbot_knowledge_sources;
CREATE POLICY "public_read_active_chatbot_sources"
  ON public.chatbot_knowledge_sources FOR SELECT
  USING (is_active = TRUE AND processing_status = 'ready');

DROP POLICY IF EXISTS "admin_manage_chatbot_sources" ON public.chatbot_knowledge_sources;
CREATE POLICY "admin_manage_chatbot_sources"
  ON public.chatbot_knowledge_sources FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
