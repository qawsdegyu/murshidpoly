-- Exam study planner: persisted plans, timer sessions, and admin visibility control

CREATE TABLE IF NOT EXISTS public.exam_study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'خطة دراسة الامتحانات',
  exams JSONB NOT NULL DEFAULT '[]'::jsonb,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  study_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  timezone TEXT NOT NULL DEFAULT 'Asia/Amman',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS exam_study_plans_user_idx
  ON public.exam_study_plans(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.exam_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.exam_study_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('study','break','review')),
  course TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','started','completed','skipped','cancelled')),
  notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS exam_study_sessions_due_idx
  ON public.exam_study_sessions(starts_at, status, notification_sent);
CREATE INDEX IF NOT EXISTS exam_study_sessions_user_idx
  ON public.exam_study_sessions(user_id, starts_at);

ALTER TABLE public.exam_study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS exam_study_plans_owner_all ON public.exam_study_plans;
CREATE POLICY exam_study_plans_owner_all ON public.exam_study_plans
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS exam_study_plans_admin_all ON public.exam_study_plans;
CREATE POLICY exam_study_plans_admin_all ON public.exam_study_plans
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS exam_study_sessions_owner_all ON public.exam_study_sessions;
CREATE POLICY exam_study_sessions_owner_all ON public.exam_study_sessions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS exam_study_sessions_admin_all ON public.exam_study_sessions;
CREATE POLICY exam_study_sessions_admin_all ON public.exam_study_sessions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.site_settings(key, value, label_ar, label_en, category, is_public)
VALUES (
  'exam_study_planner_enabled',
  'true',
  'إظهار منسق دراسة الامتحانات',
  'Show exam study planner',
  'features',
  TRUE
)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.set_exam_study_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS exam_study_plans_updated_at ON public.exam_study_plans;
CREATE TRIGGER exam_study_plans_updated_at
BEFORE UPDATE ON public.exam_study_plans
FOR EACH ROW EXECUTE FUNCTION public.set_exam_study_updated_at();

COMMENT ON TABLE public.exam_study_plans IS 'Student exam schedules, preferences, and generated study plans.';
COMMENT ON TABLE public.exam_study_sessions IS 'Study and break timer sessions scheduled from an exam study plan.';
