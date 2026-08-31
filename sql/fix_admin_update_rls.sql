-- ====================================================================
-- 🔑 إصلاح صلاحيات الأدمن — شغّل هذا في Supabase SQL Editor
-- ====================================================================

-- الخطوة 1: اعرف الـ UUID الخاص بكل أدمن
SELECT id, email FROM auth.users 
WHERE email IN (
  'mocvskhfssr@gmail.com',
  'mohammedsaqer151@gmail.com',
  'abdallahtahat2006@gmail.com',
  'murshidpolytechnic372@gmail.com'
);

-- ====================================================================
-- الخطوة 2: فعّل is_admin = true لكل هؤلاء مباشرة في جدول profiles
-- ====================================================================
UPDATE public.profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN (
    'mocvskhfssr@gmail.com',
    'mohammedsaqer151@gmail.com',
    'abdallahtahat2006@gmail.com',
    'murshidpolytechnic372@gmail.com'
  )
);

-- ====================================================================
-- الخطوة 3: إذا ما في profile لهذا المستخدم أنشئه
-- ====================================================================
INSERT INTO public.profiles (id, is_admin)
SELECT u.id, true
FROM auth.users u
WHERE u.email IN (
  'mocvskhfssr@gmail.com',
  'mohammedsaqer151@gmail.com',
  'abdallahtahat2006@gmail.com',
  'murshidpolytechnic372@gmail.com'
)
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- ====================================================================
-- الخطوة 4: حدّث دالة is_admin لتعمل أكثر موثوقية
-- ====================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- اجلب الإيميل من جدول auth.users مباشرة (أكثر موثوقية من JWT)
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid()
  LIMIT 1;

  -- تحقق من الإيميل في القائمة
  IF user_email IN (
    'mocvskhfssr@gmail.com',
    'mohammedsaqer151@gmail.com',
    'abdallahtahat2006@gmail.com',
    'murshidpolytechnic372@gmail.com'
  ) THEN
    RETURN true;
  END IF;

  -- تحقق من is_admin في جدول profiles
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- الخطوة 5: تحقق — يجب أن يرجع is_admin = true لكل الأدمن
-- ====================================================================
SELECT u.email, p.is_admin
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email IN (
  'mocvskhfssr@gmail.com',
  'mohammedsaqer151@gmail.com',
  'abdallahtahat2006@gmail.com',
  'murshidpolytechnic372@gmail.com'
);

-- ====================================================================
-- ✅ بعد التشغيل: ارجع للتطبيق وجرب التعديل مرة ثانية
-- ====================================================================
