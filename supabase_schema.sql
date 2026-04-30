-- ══════════════════════════════════════════════════════════
-- MURSHID SUPABASE SCHEMA SETUP
-- ══════════════════════════════════════════════════════════
-- Run this script in your Supabase SQL Editor to set up the necessary tables and RLS policies.

-- 1. PROFILES TABLE
-- Stores extended user information linked to Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  major TEXT,
  academic_year TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  last_device_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 2. ANNOUNCEMENTS TABLE
-- Stores platform-wide and major-specific announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  titleAr TEXT,
  shortDescription TEXT,
  shortDescriptionAr TEXT,
  fullDescription TEXT,
  fullDescriptionAr TEXT,
  badge TEXT,
  badgeAr TEXT,
  imageUrl TEXT,
  ctaLabel TEXT,
  ctaLabelAr TEXT,
  ctaLink TEXT,
  is_global BOOLEAN DEFAULT TRUE,
  target_major TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 3. USER DEVICES TABLE
-- Track user logins for security and "one account per device" logic
CREATE TABLE IF NOT EXISTS public.user_devices (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  device_id TEXT,
  user_agent TEXT,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  PRIMARY KEY (user_id, device_id)
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES

-- Profiles: Anyone can view profiles (for dashboard greetings), but only owners can update.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Announcements: Viewable by everyone.
CREATE POLICY "Announcements are viewable by everyone." ON public.announcements
  FOR SELECT USING (TRUE);

-- User Devices: Only owners can view/manage their devices.
CREATE POLICY "Users can view their own devices." ON public.user_devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own devices." ON public.user_devices
  FOR ALL USING (auth.uid() = user_id);

-- 6. AUTOMATIC PROFILE CREATION TRIGGER
-- This ensures that when a user signs up via Auth, a profile is created automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, major, academic_year, last_device_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'major',
    NEW.raw_user_meta_data->>'academic_year',
    NEW.raw_user_meta_data->>'initial_device_id'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. SEED INITIAL DATA
-- Add the official launch announcement so the hero section looks complete
INSERT INTO public.announcements (
  id, 
  title, 
  titleAr, 
  shortDescription, 
  shortDescriptionAr, 
  badge, 
  badgeAr, 
  is_global,
  imageUrl
)
VALUES (
  'official-launch-v1', 
  'Official Launch v1.0', 
  'الإطلاق الرسمي لـ مرشد v1.0', 
  'Created by a team of 2nd-year Engineering Students at BAU.', 
  'تم إنشاؤه بواسطة فريق من طلاب الهندسة في السنة الثانية من جامعة البلقاء التطبيقية.', 
  'Stable', 
  'مستقر', 
  TRUE,
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=2000'
) ON CONFLICT (id) DO NOTHING;
