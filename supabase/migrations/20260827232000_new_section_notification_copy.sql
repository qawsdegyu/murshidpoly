CREATE OR REPLACE FUNCTION public.notify_course_alert_watchers()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE status_changed BOOLEAN; schedule_changed BOOLEAN;
BEGIN
  status_changed := TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status;
  schedule_changed := TG_OP = 'INSERT' OR OLD.times IS DISTINCT FROM NEW.times OR OLD.rooms IS DISTINCT FROM NEW.rooms OR OLD.lecturers IS DISTINCT FROM NEW.lecturers;
  IF status_changed OR schedule_changed THEN
    INSERT INTO public.notifications (user_id, title_ar, title_en, body_ar, body_en, type, link, payload)
    SELECT a.user_id,
      CASE WHEN TG_OP = 'INSERT' THEN 'إضافة شعبة جديدة للمادة ' ELSE 'تحديث على المادة ' END || COALESCE(NEW.course_no, ''),
      CASE WHEN TG_OP = 'INSERT' THEN 'New section for ' ELSE 'Course update: ' END || COALESCE(NEW.course_no, ''),
      CASE WHEN TG_OP = 'INSERT' THEN 'تمت إضافة الشعبة ' || COALESCE(NEW.section_no::text, '') || ' إلى مادة تتابعها.'
        WHEN status_changed AND COALESCE(NEW.status::text, '') IN ('3','مغلقة','مغلق','closed') THEN 'تم إغلاق الشعبة ' || COALESCE(NEW.section_no::text, '') || ' ومتابعتها محفوظة لديك.'
        WHEN status_changed THEN 'تغيّرت حالة الشعبة ' || COALESCE(NEW.section_no::text, '') || ' في جريدة المواد.'
        ELSE 'تغيّر وقت أو قاعة أو محاضر الشعبة ' || COALESCE(NEW.section_no::text, '') || '.' END,
      CASE WHEN TG_OP = 'INSERT' THEN 'Section ' || COALESCE(NEW.section_no::text, '') || ' was added to a course you follow.'
        WHEN status_changed AND COALESCE(NEW.status::text, '') IN ('3','closed') THEN 'Section ' || COALESCE(NEW.section_no::text, '') || ' was closed.'
        WHEN status_changed THEN 'The status of section ' || COALESCE(NEW.section_no::text, '') || ' changed.'
        ELSE 'The time, room, or instructor of section ' || COALESCE(NEW.section_no::text, '') || ' changed.' END,
      'course', '/course-newspaper', jsonb_build_object('course_no', NEW.course_no, 'section_no', NEW.section_no, 'status', NEW.status, 'event', CASE WHEN TG_OP = 'INSERT' THEN 'section_added' WHEN status_changed THEN 'status_changed' ELSE 'schedule_changed' END)
    FROM public.course_alerts a WHERE a.is_active = TRUE AND a.course_no = NEW.course_no AND (a.section_no IS NULL OR a.section_no::text = NEW.section_no::text);
  END IF;
  RETURN NEW;
END; $$;
