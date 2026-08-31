CREATE TABLE IF NOT EXISTS public.course_alert_entitlements (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  max_courses INTEGER NOT NULL DEFAULT 0 CHECK (max_courses >= 0),
  max_sections INTEGER NOT NULL DEFAULT 0 CHECK (max_sections >= 0),
  expires_at TIMESTAMPTZ,
  notes TEXT,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.course_alert_entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_read_own_alert_entitlement" ON public.course_alert_entitlements;
CREATE POLICY "users_read_own_alert_entitlement" ON public.course_alert_entitlements FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admins_manage_alert_entitlements" ON public.course_alert_entitlements;
CREATE POLICY "admins_manage_alert_entitlements" ON public.course_alert_entitlements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.enforce_course_alert_entitlement()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE e public.course_alert_entitlements%ROWTYPE; used_courses INTEGER; used_sections INTEGER; existing_course BOOLEAN;
BEGIN
  SELECT * INTO e FROM public.course_alert_entitlements WHERE user_id = NEW.user_id;
  IF NOT FOUND OR NOT e.enabled OR (e.expires_at IS NOT NULL AND e.expires_at <= NOW()) THEN
    RAISE EXCEPTION 'COURSE_ALERTS_NOT_ENTITLED';
  END IF;
  SELECT COUNT(*), COUNT(DISTINCT course_no) INTO used_sections, used_courses FROM public.course_alerts WHERE user_id = NEW.user_id AND is_active = TRUE;
  SELECT EXISTS(SELECT 1 FROM public.course_alerts WHERE user_id = NEW.user_id AND course_no = NEW.course_no AND is_active = TRUE) INTO existing_course;
  IF NOT existing_course AND used_courses >= e.max_courses THEN RAISE EXCEPTION 'COURSE_ALERT_COURSE_LIMIT'; END IF;
  IF used_sections >= e.max_sections THEN RAISE EXCEPTION 'COURSE_ALERT_SECTION_LIMIT'; END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS course_alerts_entitlement_trigger ON public.course_alerts;
CREATE TRIGGER course_alerts_entitlement_trigger BEFORE INSERT ON public.course_alerts FOR EACH ROW EXECUTE FUNCTION public.enforce_course_alert_entitlement();

CREATE OR REPLACE FUNCTION public.touch_course_alert_entitlement()
RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS course_alert_entitlement_touch ON public.course_alert_entitlements;
CREATE TRIGGER course_alert_entitlement_touch BEFORE UPDATE ON public.course_alert_entitlements FOR EACH ROW EXECUTE FUNCTION public.touch_course_alert_entitlement();
