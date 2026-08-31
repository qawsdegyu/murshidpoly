ALTER TABLE public.push_subscriptions ADD COLUMN IF NOT EXISTS push_token TEXT;
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
    SELECT NEW.id, NEW.user_id, 'push', s.push_token FROM public.push_subscriptions s WHERE s.user_id = NEW.user_id AND s.push_token IS NOT NULL ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
