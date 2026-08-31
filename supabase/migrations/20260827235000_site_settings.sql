CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  label_ar TEXT NOT NULL DEFAULT '',
  label_en TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS site_settings_public_read ON public.site_settings;
CREATE POLICY site_settings_public_read ON public.site_settings FOR SELECT USING (is_public = TRUE OR public.is_admin());
DROP POLICY IF EXISTS site_settings_admin_write ON public.site_settings;
CREATE POLICY site_settings_admin_write ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
INSERT INTO public.site_settings(key,value,label_ar,label_en,category) VALUES
('facebook_url','','رابط Facebook','Facebook URL','social'),
('instagram_url','','رابط Instagram','Instagram URL','social'),
('whatsapp_url','','رابط WhatsApp','WhatsApp URL','social'),
('contact_email','info@bau.edu.jo','البريد الإلكتروني للتواصل','Contact email','contact'),
('footer_tagline','مرشدك الأكاديمي في كل خطوة','عبارة التذييل','Footer tagline','footer')
ON CONFLICT (key) DO NOTHING;
