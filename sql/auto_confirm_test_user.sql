-- PostgreSQL RPC function to auto-confirm automated test users.
-- To be run inside Supabase SQL Editor.

CREATE OR REPLACE FUNCTION public.auto_confirm_test_user(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users
  SET email_confirmed_at = NOW(), confirmed_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
