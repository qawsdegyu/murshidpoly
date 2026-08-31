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
  course_name_ar TEXT;
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

    -- استخراج اسم المادة أو رقمها في حال لم يتوفر الاسم
    course_name_ar := COALESCE(NEW.name, NEW.course_no, '');

    INSERT INTO public.notifications (user_id, title_ar, title_en, body_ar, body_en, type, link, payload)
    SELECT
      a.user_id,
      'تحديث على المادة: ' || course_name_ar,
      'Update on Course: ' || COALESCE(NEW.course_no, ''),
      CASE
        WHEN TG_OP = 'INSERT' THEN 'تمت إضافة شعبة جديدة رقم (' || COALESCE(NEW.section_no, '') || ') لمادة (' || course_name_ar || '). افتح منسق الجدول لمراجعتها.'
        WHEN status_changed THEN 'تغيرت حالة شعبة رقم (' || COALESCE(NEW.section_no, '') || ') في مادة (' || course_name_ar || '). افتح منسق الجدول لمراجعتها.'
        ELSE 'تغيرت تفاصيل (وقت/قاعة/محاضر) شعبة (' || COALESCE(NEW.section_no, '') || ') في مادة (' || course_name_ar || ').'
      END,
      CASE
        WHEN TG_OP = 'INSERT' THEN 'A new section (' || COALESCE(NEW.section_no, '') || ') was added for (' || course_name_ar || '). Open the planner to review.'
        WHEN status_changed THEN 'The status of section (' || COALESCE(NEW.section_no, '') || ') for (' || course_name_ar || ') changed.'
        ELSE 'Details of section (' || COALESCE(NEW.section_no, '') || ') for (' || course_name_ar || ') changed.'
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
