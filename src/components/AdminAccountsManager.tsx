import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, UserPlus, Trash2, ToggleLeft, ToggleRight, RefreshCw, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const OWNER_EMAIL = 'mocvskhfssr@gmail.com';
const ROLES = [
  { value: 'admin', label: 'مشرف كامل' },
  { value: 'content_manager', label: 'مدير المحتوى' },
  { value: 'moderator', label: 'مشرف مراقبة' },
];

type AdminAccount = { user_id: string; email: string; role: string; permissions: string[]; is_active: boolean; created_at: string };
const PERMISSIONS = [{ key: 'resources', label: 'الملفات والمصادر' }, { key: 'announcements', label: 'الإعلانات' }, { key: 'marketplace', label: 'التجار والسوق' }, { key: 'professors', label: 'الدكاترة' }, { key: 'buildings', label: 'المباني' }, { key: 'courses', label: 'المواد الدراسية' }, { key: 'alert_access', label: 'اشتراكات التنبيهات' }, { key: 'chatbot_knowledge', label: 'مصادر المساعد الذكي' }, { key: 'site_settings', label: 'محتوى وروابط الموقع' }, { key: 'contact_messages', label: 'رسائل التواصل' }, { key: 'restaurants', label: 'المطاعم والاستراحات' }, { key: 'rideshare', label: 'مرشد رايد' }, { key: 'roommate', label: 'مرشد سكن' }];

export default function AdminAccountsManager({ currentEmail }: { currentEmail?: string | null }) {
  const isOwner = currentEmail?.toLowerCase() === OWNER_EMAIL;
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [permissions, setPermissions] = useState<string[]>(['resources']);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAccounts = useCallback(async () => {
    if (!isOwner) return;
    const { data, error } = await supabase.rpc('list_admin_accounts');
    if (error) { toast.error('تعذر تحميل حسابات المشرفين'); return; }
    setAccounts((data || []) as AdminAccount[]);
  }, [isOwner]);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  async function grantAdmin() {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes('@')) { toast.error('أدخل Gmail صحيحًا'); return; }
    setLoading(true);
    const { error } = await supabase.rpc('grant_admin_by_email', { target_email: normalized, target_role: role, target_permissions: permissions });
    setLoading(false);
    if (error) { toast.error(error.message.includes('No account') ? 'لا يوجد حساب مسجل بهذا Gmail' : error.message); return; }
    toast.success('تم منح صلاحية المشرف'); setEmail(''); await loadAccounts();
  }

  async function toggleAccount(account: AdminAccount) {
    const nextActive = !account.is_active;
    const { error } = await supabase.rpc('update_admin_account', { target_user_id: account.user_id, target_role: account.role, target_active: nextActive, target_permissions: account.permissions || [] });
    if (error) { toast.error(error.message); return; }
    toast.success(nextActive ? 'تم تفعيل المشرف' : 'تم إيقاف المشرف'); await loadAccounts();
  }

  async function savePermissions() { if (!editing) return; const { error } = await supabase.rpc('update_admin_account', { target_user_id: editing.user_id, target_role: editing.role, target_active: editing.is_active, target_permissions: editPermissions }); if (error) { toast.error(error.message); return; } toast.success('تم تحديث صلاحيات المشرف'); setEditing(null); await loadAccounts(); }

  async function removeAccount(account: AdminAccount) {
    if (!window.confirm(`حذف صلاحيات ${account.email}؟`)) return;
    const { error } = await supabase.rpc('remove_admin_account', { target_user_id: account.user_id });
    if (error) { toast.error(error.message); return; }
    toast.success('تمت إزالة صلاحيات المشرف'); await loadAccounts();
  }

  if (!isOwner) return <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center"><LockKeyhole className="mx-auto mb-3 h-8 w-8 text-amber-400" /><p className="font-black">إدارة المشرفين متاحة لمالك النظام فقط.</p></div>;

  return <div className="space-y-6">
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4">
      <ShieldCheck className="w-7 h-7 text-primary shrink-0" />
      <div><p className="font-black">مالك النظام المثبّت</p><p className="text-sm text-muted-foreground font-bold mt-1">{OWNER_EMAIL} — لا يمكن لأي مشرف حذفه أو تغيير دوره أو إضافة مالك بديل.</p></div>
    </div>
    <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
      <label className="space-y-2"><span className="text-xs font-black text-muted-foreground">Gmail الحساب</span><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@gmail.com" className="w-full rounded-xl bg-surface border border-border/50 px-4 py-3 font-bold outline-none focus:border-primary" /></label>
      <div className="md:col-span-3 rounded-xl border border-border/50 bg-surface/50 p-4"><p className="text-xs font-black text-muted-foreground mb-3">الصلاحيات (يمكن اختيار أكثر من صلاحية)</p><div className="flex flex-wrap gap-2">{PERMISSIONS.map((item) => <label key={item.key} className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-bold cursor-pointer"><input type="checkbox" checked={permissions.includes(item.key)} onChange={(e) => setPermissions((current) => e.target.checked ? [...current, item.key] : current.filter((key) => key !== item.key))} />{item.label}</label>)}</div></div><button onClick={grantAdmin} disabled={loading} className="h-12 rounded-xl bg-primary text-white px-5 font-black flex items-center justify-center gap-2 disabled:opacity-50"><UserPlus className="w-4 h-4" />منح الصلاحية</button>
    </div>
    <div className="flex items-center justify-between"><h4 className="font-black text-lg">الحسابات المصرح لها ({accounts.length})</h4><button onClick={loadAccounts} className="p-2 rounded-lg bg-surface border border-border/50 hover:border-primary/50"><RefreshCw className="w-4 h-4" /></button></div>
    <div className="space-y-3">{accounts.map((account) => <div key={account.user_id} className="rounded-2xl border border-border/50 bg-surface/50 p-4 flex flex-wrap items-center gap-3"><div className="flex-1 min-w-[220px]"><p className="font-black break-all">{account.email}</p><div className="flex flex-wrap gap-1 mt-2">{(account.permissions || []).map((permission) => <span key={permission} className="text-[10px] rounded-md bg-primary/10 text-primary px-2 py-1 font-bold">{PERMISSIONS.find((item) => item.key === permission)?.label || permission}</span>)}</div></div><span className={cn('text-xs font-black px-3 py-1 rounded-full', account.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>{account.is_active ? 'فعّال' : 'موقوف'}</span>{account.email.toLowerCase() !== OWNER_EMAIL && <><button onClick={() => { setEditing(account); setEditPermissions(account.permissions || []); }} title="تعديل الصلاحيات" className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-black">الصلاحيات</button><button onClick={() => toggleAccount(account)} title={account.is_active ? 'إيقاف' : 'تفعيل'} className="p-2 rounded-lg bg-background border border-border/50 hover:border-primary/50">{account.is_active ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}</button><button onClick={() => removeAccount(account)} title="إزالة الصلاحية" className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 className="w-5 h-5" /></button></>}</div>)}{accounts.length === 0 && <p className="text-center text-muted-foreground font-bold py-8">لا توجد حسابات مشرفين إضافية.</p>}</div>
  {editing && <div className="fixed inset-0 z-[180] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/70" onClick={() => setEditing(null)} /><div className="relative w-full max-w-xl rounded-3xl bg-card border border-border p-6 shadow-2xl"><h3 className="text-xl font-black">تعديل صلاحيات {editing.email}</h3><div className="flex flex-wrap gap-2 mt-5">{PERMISSIONS.map((item) => <label key={item.key} className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-bold cursor-pointer"><input type="checkbox" checked={editPermissions.includes(item.key)} onChange={(e) => setEditPermissions((current) => e.target.checked ? [...current, item.key] : current.filter((key) => key !== item.key))} />{item.label}</label>)}</div><div className="flex gap-3 mt-6"><button onClick={() => setEditing(null)} className="flex-1 rounded-xl bg-surface border border-border/50 px-4 py-3 font-black">إلغاء</button><button onClick={savePermissions} className="flex-1 rounded-xl bg-primary text-white px-4 py-3 font-black">حفظ الصلاحيات</button></div></div></div>}</div>;
}
