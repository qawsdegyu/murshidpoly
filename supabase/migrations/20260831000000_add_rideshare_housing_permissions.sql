-- Update default permissions to include rideshare and housing
ALTER TABLE public.admin_accounts 
ALTER COLUMN permissions SET DEFAULT ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages','rideshare','roommate'];

-- Recreate the get_my_admin_permissions function
CREATE OR REPLACE FUNCTION public.get_my_admin_permissions()
RETURNS TEXT[] LANGUAGE sql SECURITY DEFINER SET search_path = public, auth AS $$
  SELECT CASE 
    WHEN public.is_system_owner() THEN ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages','rideshare','roommate']::TEXT[] 
    ELSE COALESCE((SELECT permissions FROM public.admin_accounts WHERE user_id = auth.uid() AND is_active = TRUE), ARRAY[]::TEXT[]) 
  END;
$$;

-- Recreate grant_admin_by_email to include new permissions in allowed list
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(target_email TEXT, target_role TEXT DEFAULT 'admin', target_permissions TEXT[] DEFAULT ARRAY[]::TEXT[])
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE 
  target_id UUID; 
  normalized_email TEXT := lower(trim(target_email)); 
  allowed TEXT[] := ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages','rideshare','roommate']; 
  cleaned TEXT[];
BEGIN
  IF NOT public.is_system_owner() THEN RAISE EXCEPTION 'Only the system owner can manage administrators'; END IF;
  IF normalized_email = 'mocvskhfssr@gmail.com' THEN RAISE EXCEPTION 'The system owner cannot be replaced or modified'; END IF;
  IF target_role NOT IN ('admin','content_manager','moderator') THEN RAISE EXCEPTION 'Invalid administrator role'; END IF;
  
  SELECT COALESCE(array_agg(p ORDER BY p), ARRAY[]::TEXT[]) INTO cleaned FROM unnest(target_permissions) p WHERE p = ANY(allowed);
  
  SELECT id INTO target_id FROM auth.users WHERE lower(email) = normalized_email LIMIT 1;
  IF target_id IS NULL THEN RAISE EXCEPTION 'No account found for this Gmail'; END IF;
  
  INSERT INTO public.admin_accounts(user_id,email,role,permissions,is_active,granted_by) 
  VALUES (target_id,normalized_email,target_role,cleaned,TRUE,auth.uid()) 
  ON CONFLICT (user_id) DO UPDATE SET email=EXCLUDED.email, role=EXCLUDED.role, permissions=EXCLUDED.permissions, is_active=TRUE, granted_by=auth.uid(), updated_at=NOW();
  
  INSERT INTO public.profiles(id,is_admin) VALUES (target_id,TRUE) ON CONFLICT (id) DO UPDATE SET is_admin=TRUE;
  
  RETURN jsonb_build_object('user_id',target_id,'email',normalized_email,'role',target_role,'permissions',cleaned,'is_active',TRUE);
END; $$;

-- Recreate update_admin_account
CREATE OR REPLACE FUNCTION public.update_admin_account(target_user_id UUID, target_role TEXT, target_active BOOLEAN, target_permissions TEXT[] DEFAULT ARRAY[]::TEXT[])
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
DECLARE 
  allowed TEXT[] := ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages','rideshare','roommate']; 
  cleaned TEXT[];
BEGIN
  IF NOT public.is_system_owner() THEN RAISE EXCEPTION 'Only the system owner can manage administrators'; END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id AND lower(email) = 'mocvskhfssr@gmail.com') THEN RAISE EXCEPTION 'The system owner cannot be changed'; END IF;
  IF target_role NOT IN ('admin','content_manager','moderator') THEN RAISE EXCEPTION 'Invalid administrator role'; END IF;
  
  SELECT COALESCE(array_agg(p ORDER BY p), ARRAY[]::TEXT[]) INTO cleaned FROM unnest(target_permissions) p WHERE p = ANY(allowed);
  
  UPDATE public.admin_accounts SET role=target_role, permissions=cleaned, is_active=target_active, updated_at=NOW() WHERE user_id=target_user_id;
  UPDATE public.profiles SET is_admin=target_active WHERE id=target_user_id;
  
  RETURN FOUND;
END; $$;

-- Update existing owner permissions
UPDATE public.admin_accounts
SET permissions = ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages','rideshare','housing']
WHERE lower(email) = 'mocvskhfssr@gmail.com';

-- Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';
