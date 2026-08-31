CREATE OR REPLACE FUNCTION public.list_admin_accounts()
RETURNS TABLE(user_id UUID, email TEXT, role TEXT, permissions TEXT[], is_active BOOLEAN, created_at TIMESTAMPTZ)
LANGUAGE sql SECURITY DEFINER SET search_path = public, auth AS $$
  SELECT
    u.id AS user_id,
    lower(u.email) AS email,
    CASE
      WHEN lower(u.email) = 'mocvskhfssr@gmail.com' THEN 'owner'
      ELSE COALESCE(a.role, 'admin')
    END AS role,
    COALESCE(
      a.permissions,
      ARRAY['professors','buildings','restaurants','courses','resources','announcements','chatbot_knowledge','alert_access','marketplace','site_settings','contact_messages']::TEXT[]
    ) AS permissions,
    COALESCE(a.is_active, p.is_admin, FALSE) AS is_active,
    COALESCE(a.created_at, u.created_at, NOW()) AS created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.admin_accounts a ON a.user_id = u.id
  WHERE public.is_system_owner()
    AND (COALESCE(p.is_admin, FALSE) = TRUE OR a.user_id IS NOT NULL)
  ORDER BY COALESCE(a.created_at, u.created_at, NOW()) ASC;
$$;

REVOKE ALL ON FUNCTION public.list_admin_accounts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admin_accounts() TO authenticated;
