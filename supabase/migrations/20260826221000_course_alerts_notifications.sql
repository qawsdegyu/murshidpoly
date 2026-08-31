CREATE TABLE IF NOT EXISTS public.course_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_no TEXT NOT NULL,
  section_no TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT course_alerts_unique_watch UNIQUE (user_id, course_no, section_no)
);

CREATE INDEX IF NOT EXISTS course_alerts_lookup_idx
  ON public.course_alerts (course_no, section_no, is_active);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  body_ar TEXT NOT NULL,
  body_en TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'course',
  link TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications (user_id, created_at DESC);

ALTER TABLE public.course_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_course_alerts" ON public.course_alerts;
CREATE POLICY "users_manage_own_course_alerts" ON public.course_alerts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_read_own_notifications" ON public.notifications;
CREATE POLICY "users_read_own_notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_mark_own_notifications_read" ON public.notifications;
CREATE POLICY "users_mark_own_notifications_read" ON public.notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_manage_notifications" ON public.notifications;
CREATE POLICY "admin_manage_notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.notify_course_alert_watchers()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  status_changed BOOLEAN;
  schedule_changed BOOLEAN;
BEGIN
  status_changed := TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status;
  schedule_changed := TG_OP = 'INSERT'
    OR OLD.times IS DISTINCT FROM NEW.times
    OR OLD.rooms IS DISTINCT FROM NEW.rooms
    OR OLD.lecturers IS DISTINCT FROM NEW.lecturers;

  IF status_changed OR schedule_changed THEN
    INSERT INTO public.notifications (user_id, title_ar, title_en, body_ar, body_en, type, link, payload)
    SELECT
      a.user_id,
      'تحديث على المادة ' || COALESCE(NEW.course_no, ''),
      'Course update: ' || COALESCE(NEW.course_no, ''),
      CASE
        WHEN status_changed AND COALESCE(NEW.status::text, '') IN ('3', 'مغلقة', 'مغلق', 'closed') THEN 'تم إغلاق الشعبة ' || COALESCE(NEW.section_no::text, '') || ' ومتابعتها محفوظة لديك.'
        WHEN status_changed THEN 'تغيّرت حالة الشعبة ' || COALESCE(NEW.section_no::text, '') || ' في جريدة المواد.'
        ELSE 'تغيّر وقت أو قاعة أو محاضر الشعبة ' || COALESCE(NEW.section_no::text, '') || '.'
      END,
      CASE
        WHEN status_changed AND COALESCE(NEW.status::text, '') IN ('3', 'closed') THEN 'Section ' || COALESCE(NEW.section_no::text, '') || ' was closed.'
        WHEN status_changed THEN 'The status of section ' || COALESCE(NEW.section_no::text, '') || ' changed.'
        ELSE 'The time, room, or instructor of section ' || COALESCE(NEW.section_no::text, '') || ' changed.'
      END,
      'course', '/course-newspaper', jsonb_build_object('course_no', NEW.course_no, 'section_no', NEW.section_no, 'status', NEW.status)
    FROM public.course_alerts a
    WHERE a.is_active = TRUE
      AND a.course_no = NEW.course_no
      AND (a.section_no IS NULL OR a.section_no::text = NEW.section_no::text);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS university_courses_alert_trigger ON public.university_courses;
CREATE TRIGGER university_courses_alert_trigger
  AFTER INSERT OR UPDATE OF status, times, rooms, lecturers ON public.university_courses
  FOR EACH ROW EXECUTE FUNCTION public.notify_course_alert_watchers();
