-- ====================================================================
-- 🔑 Murshid - BAU Engineering Hub
-- Master Admin Setup Script (All-in-One)
-- ====================================================================
-- تعليمات: افتح Supabase Dashboard → SQL Editor → New Query
-- الصق هذا الكود كاملاً ثم اضغط Run
-- ====================================================================

-- ============================================================
-- الخطوة 1: دالة is_admin المحسّنة
-- تقرأ من auth.users مباشرة (أكثر موثوقية من JWT)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- اقرأ الإيميل مباشرة من جدول auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid()
  LIMIT 1;

  -- تحقق من قائمة الإيميلات المصرّح لها
  IF user_email IN (
    'mocvskhfssr@gmail.com',
    'mohammedsaqer151@gmail.com',
    'abdallahtahat2006@gmail.com',
    'murshidpolytechnic372@gmail.com'
  ) THEN
    RETURN true;
  END IF;

  -- تحقق من حقل is_admin في جدول profiles (للأدمن المضافين يدوياً)
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- الخطوة 2: تفعيل is_admin = true لجميع الأدمن في profiles
-- ============================================================
INSERT INTO public.profiles (id, is_admin)
SELECT u.id, true
FROM auth.users u
WHERE u.email IN (
  'mocvskhfssr@gmail.com',
  'mohammedsaqer151@gmail.com',
  'abdallahtahat2006@gmail.com',
  'murshidpolytechnic372@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- ============================================================
-- الخطوة 3: تفعيل Row Level Security على جميع الجداول
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recreation_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_mode ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- الخطوة 4: حذف جميع الـ policies القديمة (لتجنب التعارض)
-- ============================================================
DO $$
DECLARE
  t text;
  p text;
BEGIN
  FOR t, p IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN (
      'profiles', 'professors', 'buildings', 'recreation_places',
      'courses', 'resources', 'announcements', 'maintenance_mode'
    )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p, t);
  END LOOP;
END $$;

-- ============================================================
-- الخطوة 5: إنشاء Policies جديدة
-- ============================================================

-- --- PROFILES ---
CREATE POLICY "public_read_profiles"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_full_access_profiles"
  ON public.profiles TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- PROFESSORS ---
CREATE POLICY "public_read_professors"
  ON public.professors FOR SELECT USING (true);

CREATE POLICY "admin_full_access_professors"
  ON public.professors TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- BUILDINGS ---
CREATE POLICY "public_read_buildings"
  ON public.buildings FOR SELECT USING (true);

CREATE POLICY "admin_full_access_buildings"
  ON public.buildings TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- RECREATION PLACES ---
CREATE POLICY "public_read_recreation_places"
  ON public.recreation_places FOR SELECT USING (true);

CREATE POLICY "admin_full_access_recreation_places"
  ON public.recreation_places TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- COURSES ---
CREATE POLICY "public_read_courses"
  ON public.courses FOR SELECT USING (true);

CREATE POLICY "admin_full_access_courses"
  ON public.courses TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- RESOURCES ---
CREATE POLICY "public_read_resources"
  ON public.resources FOR SELECT USING (true);

CREATE POLICY "admin_full_access_resources"
  ON public.resources TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- ANNOUNCEMENTS ---
CREATE POLICY "public_read_announcements"
  ON public.announcements FOR SELECT USING (true);

CREATE POLICY "admin_full_access_announcements"
  ON public.announcements TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --- MAINTENANCE MODE ---
CREATE POLICY "public_read_maintenance_mode"
  ON public.maintenance_mode FOR SELECT USING (true);

CREATE POLICY "admin_full_access_maintenance_mode"
  ON public.maintenance_mode TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- الخطوة 6: إضافة الأعمدة الناقصة (آمن - لا يؤثر على البيانات)
-- ============================================================

-- professors
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS rank TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS rank_ar TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS office_hours TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS profile_url TEXT;
ALTER TABLE public.professors ADD COLUMN IF NOT EXISTS building_id INTEGER;

-- recreation_places
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS map_url TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS icon_name TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.recreation_places ADD COLUMN IF NOT EXISTS menu JSONB DEFAULT '[]'::jsonb;

-- courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructors TEXT[];

-- resources
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS uploader TEXT DEFAULT 'المشرف';
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS size TEXT;

-- ============================================================
-- الخطوة 7: التحقق النهائي
-- ============================================================
SELECT
  u.email,
  p.is_admin,
  public.is_admin() AS is_admin_function_result
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email IN (
  'mocvskhfssr@gmail.com',
  'mohammedsaqer151@gmail.com',
  'abdallahtahat2006@gmail.com',
  'murshidpolytechnic372@gmail.com'
);

-- ============================================================
-- ✅ انتهى! ارجع للتطبيق وجرب التعديل مرة ثانية
-- ============================================================
SELECT 'Murshid Admin Setup Complete ✅' AS status;
