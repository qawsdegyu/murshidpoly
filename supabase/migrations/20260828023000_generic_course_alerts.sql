CREATE OR REPLACE FUNCTION public.notify_course_alert_watchers()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  status_changed BOOLEAN;
  schedule_changed BOOLEAN;
  event_name TEXT;
BEGIN
  status_changed := TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status;
  schedule_changed := TG_OP = 'INSERT'
    OR OLD.times IS DISTINCT FROM NEW.times
    OR OLD.rooms IS DISTINCT FROM NEW.rooms
    OR OLD.lecturers IS DISTINCT FROM NEW.lecturers;

  IF status_changed OR schedule_changed THEN
    event_name := CASE
      WHEN TG_OP = 'INSERT' THEN 'section_opened'
      WHEN status_changed THEN 'course_status_updated'
      ELSE 'course_schedule_updated'
    END;

    INSERT INTO public.notifications (user_id, title_ar, title_en, body_ar, body_en, type, link, payload)
    SELECT
      a.user_id,
      'تحديث جديد في جريدتك الدراسية',
      'New update in your course newspaper',
      CASE
        WHEN TG_OP = 'INSERT' THEN 'يوجد تحديث جديد على مادة تتابعها. افتح منسق الجدول لمراجعة أفضل خيار تلقائيًا.'
        WHEN status_changed THEN 'يوجد تحديث جديد على إحدى المواد التي تتابعها. افتح منسق الجدول لمراجعة جدولك.'
        ELSE 'تم تحديث بيانات إحدى المواد التي تتابعها. افتح منسق الجدول لمراجعة جدولك.'
      END,
      CASE
        WHEN TG_OP = 'INSERT' THEN 'There is a new update for a course you follow. Open the planner to review the best option automatically.'
        WHEN status_changed THEN 'There is a new update for a course you follow. Open the planner to review your schedule.'
        ELSE 'A course you follow has updated details. Open the planner to review your schedule.'
      END,
      'course_alert',
      '/schedule?planner=course&auto=1&course=' || encode(convert_to(COALESCE(NEW.course_no, ''), 'UTF8'), 'escape'),
      jsonb_build_object(
        'course_no', NEW.course_no,
        'course_id', NEW.course_no,
        'section_no', NEW.section_no,
        'status', NEW.status,
        'event', event_name
      )
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
