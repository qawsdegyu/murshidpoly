CREATE TABLE IF NOT EXISTS public.admin_accounts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner','admin','content_manager','moderator')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_system_owner()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND lower(email) = 'mocvskhfssr@gmail.com');
END; $$;
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  IF public.is_system_owner() THEN RETURN TRUE; END IF;
  RETURN EXISTS (SELECT 1 FROM public.admin_accounts a WHERE a.user_id = auth.uid() AND a.is_active = TRUE)
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE);
END; $$;
DROP POLICY IF EXISTS admin_accounts_owner_read ON public.admin_accounts;
CREATE POLICY admin_accounts_owner_read ON public.admin_accounts FOR SELECT TO authenticated USING (public.is_system_owner());
CREATE OR REPLACE FUNCTION public.list_admin_accounts()
RETURNS TABLE(user_id UUID, email TEXT, role TEXT, is_active BOOLEAN, created_at TIMESTAMPTZ)
LANGUAGE sql SECURITY DEFINER SET search_path = public, auth AS $$
  SELECT a.user_id, a.email, a.role, a.is_active, a.created_at FROM public.admin_accounts a WHERE public.is_system_owner() ORDER BY a.created_at ASC;
$$;
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(target_email TEXT, target_role TEXT DEFAULT 'admin')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE target_id UUID; normalized_email TEXT := lower(trim(target_email));
BEGIN
  IF NOT public.is_system_owner() THEN RAISE EXCEPTION 'Only the system owner can manage administrators'; END IF;
  IF normalized_email = 'mocvskhfssr@gmail.com' THEN RAISE EXCEPTION 'The system owner cannot be replaced or modified'; END IF;
  IF target_role NOT IN ('admin','content_manager','moderator') THEN RAISE EXCEPTION 'Invalid administrator role'; END IF;
  SELECT id INTO target_id FROM auth.users WHERE lower(email) = normalized_email LIMIT 1;
  IF target_id IS NULL THEN RAISE EXCEPTION 'No account found for this Gmail'; END IF;
  INSERT INTO public.admin_accounts(user_id,email,role,is_active,granted_by) VALUES (target_id,normalized_email,target_role,TRUE,auth.uid())
  ON CONFLICT (user_id) DO UPDATE SET email=EXCLUDED.email, role=EXCLUDED.role, is_active=TRUE, granted_by=auth.uid(), updated_at=NOW();
  INSERT INTO public.profiles(id,is_admin) VALUES (target_id,TRUE) ON CONFLICT (id) DO UPDATE SET is_admin=TRUE;
  RETURN jsonb_build_object('user_id',target_id,'email',normalized_email,'role',target_role,'is_active',TRUE);
END; $$;
CREATE OR REPLACE FUNCTION public.update_admin_account(target_user_id UUID, target_role TEXT, target_active BOOLEAN)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  IF NOT public.is_system_owner() THEN RAISE EXCEPTION 'Only the system owner can manage administrators'; END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id AND lower(email) = 'mocvskhfssr@gmail.com') THEN RAISE EXCEPTION 'The system owner cannot be changed'; END IF;
  IF target_role NOT IN ('admin','content_manager','moderator') THEN RAISE EXCEPTION 'Invalid administrator role'; END IF;
  UPDATE public.admin_accounts SET role=target_role, is_active=target_active, updated_at=NOW() WHERE user_id=target_user_id;
  UPDATE public.profiles SET is_admin=target_active WHERE id=target_user_id;
  RETURN FOUND;
END; $$;
CREATE OR REPLACE FUNCTION public.remove_admin_account(target_user_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  IF NOT public.is_system_owner() THEN RAISE EXCEPTION 'Only the system owner can remove administrators'; END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id AND lower(email) = 'mocvskhfssr@gmail.com') THEN RAISE EXCEPTION 'The system owner cannot be removed'; END IF;
  DELETE FROM public.admin_accounts WHERE user_id=target_user_id;
  UPDATE public.profiles SET is_admin=FALSE WHERE id=target_user_id;
  RETURN FOUND;
END; $$;
INSERT INTO public.admin_accounts(user_id,email,role,is_active)
SELECT id, lower(email), 'owner', TRUE FROM auth.users WHERE lower(email)='mocvskhfssr@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET email=EXCLUDED.email, role='owner', is_active=TRUE;
REVOKE ALL ON FUNCTION public.list_admin_accounts() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.grant_admin_by_email(TEXT,TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_admin_account(UUID,TEXT,BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.remove_admin_account(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admin_accounts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(TEXT,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_admin_account(UUID,TEXT,BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin_account(UUID) TO authenticated;
