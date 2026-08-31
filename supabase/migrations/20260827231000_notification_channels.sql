CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  installation_id TEXT NOT NULL,
  endpoint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, installation_id)
);
CREATE TABLE IF NOT EXISTS public.notification_delivery_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email','push')),
  destination TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (notification_id, channel, destination)
);
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_delivery_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS users_manage_notification_preferences ON public.notification_preferences;
CREATE POLICY users_manage_notification_preferences ON public.notification_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS users_manage_push_subscriptions ON public.push_subscriptions;
CREATE POLICY users_manage_push_subscriptions ON public.push_subscriptions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS admins_manage_notification_queue ON public.notification_delivery_queue;
CREATE POLICY admins_manage_notification_queue ON public.notification_delivery_queue FOR SELECT TO authenticated USING (public.is_admin());
CREATE OR REPLACE FUNCTION public.enqueue_notification_deliveries()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE email_address TEXT; email_ok BOOLEAN := TRUE; push_ok BOOLEAN := TRUE;
BEGIN
  SELECT u.email, COALESCE(p.email_enabled, TRUE), COALESCE(p.push_enabled, TRUE) INTO email_address, email_ok, push_ok FROM auth.users u LEFT JOIN public.notification_preferences p ON p.user_id = NEW.user_id WHERE u.id = NEW.user_id;
  IF email_ok AND email_address IS NOT NULL THEN
    INSERT INTO public.notification_delivery_queue(notification_id,user_id,channel,destination) VALUES (NEW.id, NEW.user_id, 'email', email_address) ON CONFLICT DO NOTHING;
  END IF;
  IF push_ok THEN
    INSERT INTO public.notification_delivery_queue(notification_id,user_id,channel,destination)
    SELECT NEW.id, NEW.user_id, 'push', s.installation_id FROM public.push_subscriptions s WHERE s.user_id = NEW.user_id ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS notification_delivery_enqueue_trigger ON public.notifications;
CREATE TRIGGER notification_delivery_enqueue_trigger AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.enqueue_notification_deliveries();
