-- Keep legacy chatbot sources separate from the Murshid AI knowledge base.
ALTER TABLE public.chatbot_knowledge_sources
  ADD COLUMN IF NOT EXISTS assistant_scope text NOT NULL DEFAULT 'murshid';

-- Existing Drive ingestion belongs to Murshid AI; manually uploaded legacy sources
-- remain available to the old chatbot manager.
UPDATE public.chatbot_knowledge_sources
SET assistant_scope = CASE
  WHEN source_type = 'upload' THEN 'legacy'
  ELSE 'murshid'
END;

CREATE INDEX IF NOT EXISTS chatbot_knowledge_sources_assistant_scope_idx
  ON public.chatbot_knowledge_sources (assistant_scope, is_active, processing_status);

COMMENT ON COLUMN public.chatbot_knowledge_sources.assistant_scope IS
  'Assistant scope: legacy for the floating chatbot, murshid for the dedicated Murshid AI assistant.';

SELECT assistant_scope, source_type, COUNT(*) AS source_count
FROM public.chatbot_knowledge_sources
GROUP BY assistant_scope, source_type
ORDER BY assistant_scope, source_type
LIMIT 20;
