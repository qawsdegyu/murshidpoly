import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type SiteSettings = Record<string, string>;

const defaults: SiteSettings = {
  facebook_url: '',
  instagram_url: '',
  whatsapp_url: '',
  contact_email: 'info@bau.edu.jo',
  powered_by_url: 'https://www.operixsys.online/',
  exam_study_planner_enabled: 'true',
  study_schedule_planner_enabled: 'true',
  // Fail closed while public settings are loading so an Offline feature never flashes into view.
  knowledge_assistant_enabled: 'false',
  knowledge_assistant_access_mode: 'all',
  study_planner_access_mode: 'all',
  exam_planner_access_mode: 'all',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase.from('site_settings').select('key,value').eq('is_public', true).limit(100);
      if (!mounted || !data) return;
      setSettings({ ...defaults, ...Object.fromEntries(data.map((row) => [row.key, row.value || ''])) });
    };
    const refresh = () => { void load(); };
    void load();
    window.addEventListener('site-settings-updated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      mounted = false;
      window.removeEventListener('site-settings-updated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  return settings;
}
