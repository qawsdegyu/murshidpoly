ALTER TABLE public.admin_accounts ADD COLUMN IF NOT EXISTS permissions TEXT[] NOT NULL DEFAULT ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages'];
DROP FUNCTION IF EXISTS public.list_admin_accounts();
DROP FUNCTION IF EXISTS public.grant_admin_by_email(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.update_admin_account(UUID, TEXT, BOOLEAN);
CREATE OR REPLACE FUNCTION public.admin_has_permission(required_permission TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  IF public.is_system_owner() THEN RETURN TRUE; END IF;
  RETURN EXISTS (SELECT 1 FROM public.admin_accounts a WHERE a.user_id = auth.uid() AND a.is_active = TRUE AND required_permission = ANY(a.permissions));
END; $$;
CREATE OR REPLACE FUNCTION public.get_my_admin_permissions()
RETURNS TEXT[] LANGUAGE sql SECURITY DEFINER SET search_path = public, auth AS $$
  SELECT CASE WHEN public.is_system_owner() THEN ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages']::TEXT[] ELSE COALESCE((SELECT permissions FROM public.admin_accounts WHERE user_id = auth.uid() AND is_active = TRUE), ARRAY[]::TEXT[]) END;
$$;
GRANT EXECUTE ON FUNCTION public.get_my_admin_permissions() TO authenticated;
CREATE OR REPLACE FUNCTION public.list_admin_accounts()
RETURNS TABLE(user_id UUID, email TEXT, role TEXT, permissions TEXT[], is_active BOOLEAN, created_at TIMESTAMPTZ)
LANGUAGE sql SECURITY DEFINER SET search_path = public, auth AS $$
  SELECT a.user_id, a.email, a.role, a.permissions, a.is_active, a.created_at FROM public.admin_accounts a WHERE public.is_system_owner() ORDER BY a.created_at ASC;
$$;
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(target_email TEXT, target_role TEXT DEFAULT 'admin', target_permissions TEXT[] DEFAULT ARRAY[]::TEXT[])
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE target_id UUID; normalized_email TEXT := lower(trim(target_email)); allowed TEXT[] := ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages']; cleaned TEXT[];
BEGIN
  IF NOT public.is_system_owner() THEN RAISE EXCEPTION 'Only the system owner can manage administrators'; END IF;
  IF normalized_email = 'mocvskhfssr@gmail.com' THEN RAISE EXCEPTION 'The system owner cannot be replaced or modified'; END IF;
  IF target_role NOT IN ('admin','content_manager','moderator') THEN RAISE EXCEPTION 'Invalid administrator role'; END IF;
  SELECT COALESCE(array_agg(p ORDER BY p), ARRAY[]::TEXT[]) INTO cleaned FROM unnest(target_permissions) p WHERE p = ANY(allowed);
  SELECT id INTO target_id FROM auth.users WHERE lower(email) = normalized_email LIMIT 1;
  IF target_id IS NULL THEN RAISE EXCEPTION 'No account found for this Gmail'; END IF;
  INSERT INTO public.admin_accounts(user_id,email,role,permissions,is_active,granted_by) VALUES (target_id,normalized_email,target_role,cleaned,TRUE,auth.uid()) ON CONFLICT (user_id) DO UPDATE SET email=EXCLUDED.email, role=EXCLUDED.role, permissions=EXCLUDED.permissions, is_active=TRUE, granted_by=auth.uid(), updated_at=NOW();
  INSERT INTO public.profiles(id,is_admin) VALUES (target_id,TRUE) ON CONFLICT (id) DO UPDATE SET is_admin=TRUE;
  RETURN jsonb_build_object('user_id',target_id,'email',normalized_email,'role',target_role,'permissions',cleaned,'is_active',TRUE);
END; $$;
CREATE OR REPLACE FUNCTION public.update_admin_account(target_user_id UUID, target_role TEXT, target_active BOOLEAN, target_permissions TEXT[] DEFAULT ARRAY[]::TEXT[])
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE allowed TEXT[] := ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages']; cleaned TEXT[];
BEGIN
  IF NOT public.is_system_owner() THEN RAISE EXCEPTION 'Only the system owner can manage administrators'; END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id AND lower(email) = 'mocvskhfssr@gmail.com') THEN RAISE EXCEPTION 'The system owner cannot be changed'; END IF;
  IF target_role NOT IN ('admin','content_manager','moderator') THEN RAISE EXCEPTION 'Invalid administrator role'; END IF;
  SELECT COALESCE(array_agg(p ORDER BY p), ARRAY[]::TEXT[]) INTO cleaned FROM unnest(target_permissions) p WHERE p = ANY(allowed);
  UPDATE public.admin_accounts SET role=target_role, permissions=cleaned, is_active=target_active, updated_at=NOW() WHERE user_id=target_user_id;
  UPDATE public.profiles SET is_admin=target_active WHERE id=target_user_id;
  RETURN FOUND;
END; $$;
INSERT INTO public.admin_accounts(user_id,email,role,permissions,is_active)
SELECT id, lower(email), 'owner', ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages'], TRUE FROM auth.users WHERE lower(email)='mocvskhfssr@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role='owner', permissions=EXCLUDED.permissions, is_active=TRUE;
