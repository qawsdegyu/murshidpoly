import { useEffect, useMemo, useState } from 'react';
import { Power, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type FeatureId = 'knowledge' | 'exam' | 'study';
const config: Record<FeatureId, { enabled: string; mode: string; emails: string; majors?: string; title: string; description: string }> = {
  knowledge: { enabled: 'knowledge_assistant_enabled', mode: 'knowledge_assistant_access_mode', emails: 'knowledge_assistant_allowed_emails', majors: 'knowledge_assistant_allowed_majors', title: 'مساعد مُرشد الذكي الجديد', description: 'تحكم مستقل بالمساعد الذي يبحث في ملفات Drive ومصادر المواد.' },
  exam: { enabled: 'exam_study_planner_enabled', mode: 'exam_planner_access_mode', emails: 'exam_planner_allowed_emails', title: 'منشئ جدول الامتحانات', description: 'تحكم بميزة تحليل صورة جدول الامتحانات وبناء خطة الدراسة.' },
  study: { enabled: 'study_schedule_planner_enabled', mode: 'study_planner_access_mode', emails: 'study_planner_allowed_emails', title: 'منشئ الجدول الدراسي', description: 'تحكم بميزة تصميم الجدول الدراسي الذكي.' },
};

export default function FeatureAccessManager({ feature }: { feature: FeatureId }) {
  const c = config[feature];
  const keys = useMemo(() => [c.enabled, c.mode, c.emails, ...(c.majors ? [c.majors] : [])], [c]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('key,value').in('key', keys).limit(10);
    if (error) toast.error('تعذر تحميل إعدادات الخاصية');
    else setValues(Object.fromEntries((data || []).map(row => [row.key, row.value || ''])));
    setLoading(false);
  };
  useEffect(() => { void load(); }, [keys.join('|')]);
  const save = async () => {
    setSaving(true);
    const rows = keys.map(key => ({ key, value: values[key] || '', updated_at: new Date().toISOString(), is_public: true }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSaving(false);
    if (error) toast.error(error.message);
    else { window.dispatchEvent(new Event('site-settings-updated')); toast.success('تم حفظ إعدادات الخاصية'); }
  };
  if (loading) return <div className="flex justify-center py-16"><RefreshCw className="animate-spin text-primary" /></div>;
  const live = values[c.enabled] !== 'false';
  return <div className="max-w-2xl space-y-6">
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6"><h3 className="text-2xl font-black">{c.title}</h3><p className="mt-2 text-sm font-bold leading-6 text-muted-foreground">{c.description}</p></div>
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-surface/40 p-5"><div><p className="font-black">حالة الخاصية</p><p className="mt-1 text-xs font-bold text-muted-foreground">عند Offline تختفي الخاصية من الموقع بالكامل.</p></div><button type="button" role="switch" aria-checked={live} onClick={() => setValues(v => ({ ...v, [c.enabled]: live ? 'false' : 'true' }))} className={`relative h-10 w-28 rounded-full border transition-colors ${live ? 'border-emerald-400/50 bg-emerald-500/20' : 'border-slate-500/40 bg-slate-700/60'}`}><span className={`absolute top-1 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black transition-all ${live ? 'right-1 bg-emerald-400 text-slate-950' : 'left-1 bg-slate-300 text-slate-900'}`}>{live ? 'Live' : 'Offline'}</span></button></div>
    <label className="block space-y-2"><span className="text-sm font-black">نطاق الوصول</span><select value={values[c.mode] || 'all'} onChange={e => setValues(v => ({ ...v, [c.mode]: e.target.value }))} className="w-full rounded-xl border border-border/50 bg-surface px-4 py-3 font-bold"><option value="all">الجميع</option><option value="emails">حسابات Gmail محددة</option>{c.majors && <option value="major">تخصصات محددة</option>}</select></label>
    {values[c.mode] === 'emails' && <label className="block space-y-2"><span className="text-sm font-black">Gmail المسموحة، كل بريد في سطر</span><textarea dir="ltr" rows={6} value={values[c.emails] || ''} onChange={e => setValues(v => ({ ...v, [c.emails]: e.target.value }))} className="w-full rounded-xl border border-border/50 bg-surface px-4 py-3 font-bold" placeholder="student@example.com" /></label>}
    {c.majors && values[c.mode] === 'major' && <label className="block space-y-2"><span className="text-sm font-black">التخصصات المسموحة، كل تخصص في سطر</span><textarea dir="rtl" rows={5} value={values[c.majors] || ''} onChange={e => setValues(v => ({ ...v, [c.majors!]: e.target.value }))} className="w-full rounded-xl border border-border/50 bg-surface px-4 py-3 font-bold" /></label>}
    <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-black text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'جاري الحفظ...' : 'حفظ إعدادات الخاصية'}</button>
  </div>;
}
