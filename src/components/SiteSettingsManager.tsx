import { useEffect, useState } from 'react';
import { Save, RefreshCw, Link2, Type, Power } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const fields = [
  { key: 'powered_by_url', label: 'رابط Powered by', category: 'footer' },
  { key: 'facebook_url', label: 'رابط Facebook', category: 'social' },
  { key: 'instagram_url', label: 'رابط Instagram', category: 'social' },
  { key: 'whatsapp_url', label: 'رابط WhatsApp', category: 'social' },
  { key: 'contact_email', label: 'بريد التواصل', category: 'contact' },

] as const;

export default function SiteSettingsManager() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('key,value').limit(100);
    if (error) toast.error('تعذر تحميل إعدادات الموقع');
    else setValues(Object.fromEntries((data || []).map((row) => [row.key, row.value || ''])));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    const rows = fields.map((field) => ({ key: field.key, value: values[field.key] || '', updated_at: new Date().toISOString(), is_public: true }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      window.dispatchEvent(new Event('site-settings-updated'));
      toast.success('تم حفظ إعدادات الموقع');
    }
  }

  if (loading) return <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-primary" /></div>;

  return <div className="space-y-6">
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5"><p className="font-black text-lg">التحكم العام بالموقع</p><p className="text-sm text-muted-foreground font-bold mt-1">عدّل النصوص وروابط التواصل وحالة الخصائص من هنا، وتنعكس التغييرات على الموقع دون تعديل الكود.</p></div>
    <div className="grid gap-4">
      {fields.map((field) => field.control === 'toggle' ? (
        <div key={field.key} className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-surface/40 p-4">
          <span className="flex items-center gap-2 text-sm font-black"><Power className="w-4 h-4 text-primary" />{field.label}</span>
          <button type="button" role="switch" aria-checked={values[field.key] !== 'false'} onClick={() => setValues((current) => ({ ...current, [field.key]: current[field.key] === 'false' ? 'true' : 'false' }))} className={`relative h-9 w-24 rounded-full border transition-colors ${values[field.key] !== 'false' ? 'border-emerald-400/50 bg-emerald-500/20' : 'border-slate-500/40 bg-slate-700/60'}`}>
            <span className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-black transition-all ${values[field.key] !== 'false' ? 'right-1 bg-emerald-400 text-slate-950' : 'left-1 bg-slate-300 text-slate-900'}`}>{values[field.key] !== 'false' ? 'Live' : 'Offline'}</span>
          </button>
        </div>
      ) : field.control === 'select' ? (
        <label key={field.key} className="space-y-2"><span className="flex items-center gap-2 text-sm font-black"><Power className="w-4 h-4 text-primary" />{field.label}</span><select value={values[field.key] || 'all'} onChange={(e) => setValues((current) => ({ ...current, [field.key]: e.target.value }))} className="w-full rounded-xl bg-surface border border-border/50 px-4 py-3 font-bold outline-none focus:border-primary"><option value="all">الجميع</option><option value="major">طلاب تخصصات محددة</option><option value="emails">حسابات Gmail محددة</option></select></label>
      ) : field.control === 'textarea' ? (
        <label key={field.key} className="space-y-2"><span className="flex items-center gap-2 text-sm font-black"><Type className="w-4 h-4 text-primary" />{field.label}</span><textarea value={values[field.key] || ''} onChange={(e) => setValues((current) => ({ ...current, [field.key]: e.target.value }))} dir="ltr" rows={4} placeholder="student@example.com" className="w-full rounded-xl bg-surface border border-border/50 px-4 py-3 font-bold outline-none focus:border-primary" /></label>
      ) : (
        <label key={field.key} className="space-y-2"><span className="flex items-center gap-2 text-sm font-black">{field.category === 'social' ? <Link2 className="w-4 h-4 text-primary" /> : <Type className="w-4 h-4 text-primary" />}{field.label}</span><input value={values[field.key] || ''} onChange={(e) => setValues((current) => ({ ...current, [field.key]: e.target.value }))} dir="ltr" placeholder={field.key.endsWith('_url') ? 'https://...' : ''} className="w-full rounded-xl bg-surface border border-border/50 px-4 py-3 font-bold outline-none focus:border-primary" /></label>
      ))}
    </div>
    <button onClick={save} disabled={saving} className="w-full md:w-auto rounded-xl bg-primary text-white px-6 py-3 font-black flex items-center justify-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" />{saving ? 'جاري الحفظ...' : 'حفظ إعدادات الموقع'}</button>
  </div>;
}
