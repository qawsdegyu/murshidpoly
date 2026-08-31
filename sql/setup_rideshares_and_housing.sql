-- ========================================================
-- Setup Ride Shares & Housing Ads (RoommateMatch) Tables
-- ========================================================

-- 1. Create ride_shares table
CREATE TABLE IF NOT EXISTS public.ride_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    driver_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    available_seats INTEGER DEFAULT 3,
    price_per_seat NUMERIC(10, 2) DEFAULT 0,
    days JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist in case the table was already created in a previous version
ALTER TABLE public.ride_shares 
ADD COLUMN IF NOT EXISTS driver_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS from_location TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS to_location TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS departure_time TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS available_seats INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS price_per_seat NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS days JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 2. Create roommate_profiles (Housing Ads) table
CREATE TABLE IF NOT EXISTS public.roommate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT NOT NULL,
    location_pref TEXT NOT NULL,
    budget NUMERIC(10, 2) NOT NULL,
    rooms INTEGER DEFAULT 1,
    living_rooms INTEGER DEFAULT 1,
    furnished TEXT DEFAULT 'unfurnished',
    housing_type TEXT DEFAULT 'youth',
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist in case the table was already created in a previous version
ALTER TABLE public.roommate_profiles 
ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS location_pref TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS budget NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rooms INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS living_rooms INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS furnished TEXT DEFAULT 'unfurnished',
ADD COLUMN IF NOT EXISTS housing_type TEXT DEFAULT 'youth',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ========================================================
-- Row Level Security (RLS) Policies
-- ========================================================

-- Enable RLS
ALTER TABLE public.ride_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_profiles ENABLE ROW LEVEL SECURITY;

-- Ride Shares Policies
CREATE POLICY "Anyone can view approved rides" ON public.ride_shares FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view their own rides" ON public.ride_shares FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rides" ON public.ride_shares FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rides" ON public.ride_shares FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view and manage all rides" ON public.ride_shares USING (
  public.is_admin()
);

-- Housing Ads Policies
CREATE POLICY "Anyone can view active housing ads" ON public.roommate_profiles FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their own housing ad" ON public.roommate_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own housing ad" ON public.roommate_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own housing ad" ON public.roommate_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own housing ad" ON public.roommate_profiles FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view and manage all housing ads" ON public.roommate_profiles USING (
  public.is_admin()
);

-- Force PostgREST schema reload so the API picks up the new tables immediately
NOTIFY pgrst, 'reload schema';
