-- ====================================================================
-- Murshid Project: Master Admin RLS Permissions Setup
-- ====================================================================
-- INSTRUCTIONS: Copy all the SQL content below and run it ONCE inside 
-- your Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor).
-- ====================================================================

-- 1. Create robust Admin helper function to avoid recursive RLS policy loops
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- A. Check if user has is_admin flag set to true in profiles
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RETURN true;
  END IF;

  -- B. Backup check: Allow based on centralized list of admin emails
  IF (auth.jwt() ->> 'email') IN (
    'mocvskhfssr@gmail.com',
    'mohammedsaqer151@gmail.com',
    'abdallahtahat2006@gmail.com',
    'murshidpolytechnic372@gmail.com'
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 2. Add missing columns to ensure Admin forms can save data successfully
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS rank TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS rank_ar TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS office_hours TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS profile_url TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS building_id INTEGER;

ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS map_url TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS icon_name TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS menu JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructors TEXT[];

ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS uploader TEXT DEFAULT 'المشرف';
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS size TEXT;

-- 3. Make sure RLS is enabled on all core Murshid tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recreation_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_mode ENABLE ROW LEVEL SECURITY;

-- 3. DROP old policies on these tables if they exist to prevent name conflicts
DO $$
DECLARE
    t text;
    p text;
BEGIN
    FOR t, p IN 
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('profiles', 'professors', 'buildings', 'recreation_places', 'courses', 'resources', 'announcements', 'maintenance_mode')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p, t);
    END LOOP;
END $$;

-- ====================================================================
-- 4. CREATE NEW PUBLIC & ADMIN POLICIES
-- ====================================================================

-- --- PROFILES TABLE ---
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow admins full access on profiles" ON public.profiles TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- PROFESSORS TABLE ---
CREATE POLICY "Allow public read on professors" ON public.professors FOR SELECT USING (true);
CREATE POLICY "Allow admins full access on professors" ON public.professors TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- BUILDINGS TABLE ---
CREATE POLICY "Allow public read on buildings" ON public.buildings FOR SELECT USING (true);
CREATE POLICY "Allow admins full access on buildings" ON public.buildings TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- RECREATION PLACES TABLE ---
CREATE POLICY "Allow public read on recreation_places" ON public.recreation_places FOR SELECT USING (true);
CREATE POLICY "Allow admins full access on recreation_places" ON public.recreation_places TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- COURSES TABLE ---
CREATE POLICY "Allow public read on courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow admins full access on courses" ON public.courses TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- RESOURCES TABLE ---
CREATE POLICY "Allow public read on resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Allow admins full access on resources" ON public.resources TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- ANNOUNCEMENTS TABLE ---
CREATE POLICY "Allow public read on announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow admins full access on announcements" ON public.announcements TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- MAINTENANCE MODE TABLE ---
CREATE POLICY "Allow public read on maintenance_mode" ON public.maintenance_mode FOR SELECT USING (true);
CREATE POLICY "Allow admins full access on maintenance_mode" ON public.maintenance_mode TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ====================================================================
-- SUCCESS MESSAGE: Done! Database is now secured and Admin permissions are set.
-- ====================================================================
