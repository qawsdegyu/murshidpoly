import { useEffect, useState } from "react";
import { BellRing, Check, Loader2, Power, Search, ShieldCheck, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Entitlement = { user_id: string; enabled: boolean; max_courses: number; max_sections: number; expires_at: string | null; notes: string | null };

export default function CourseAlertsManager({ ar }: { ar: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [maxCourses, setMaxCourses] = useState("3");
  const [maxSections, setMaxSections] = useState("5");
  const [expiresAt, setExpiresAt] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("course_alert_entitlements").select("user_id,enabled,max_courses,max_sections,expires_at,notes").order("updated_at", { ascending: false }).limit(100);
    if (error) toast.error(ar ? "تعذر تحميل اشتراكات التنبيهات" : "Unable to load alert entitlements");
    setItems((data || []) as Entitlement[]);
  };
  useEffect(() => { load(); }, []);

  const search = async () => {
    const email = query.trim().toLowerCase();
    if (!email.includes("@")) { toast.error(ar ? "اكتب Gmail صحيحًا" : "Enter a valid Gmail"); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc("marketplace_find_users_by_email", { search_email: email });
    if (error) toast.error(ar ? "تعذر البحث عن الحساب" : "Unable to search account");
    setResults(data || []); setSelectedUser(""); setLoading(false);
  };

  const grant = async () => {
    if (!selectedUser) { toast.error(ar ? "اختر حسابًا أولًا" : "Select an account first"); return; }
    const courses = Math.max(0, Number(maxCourses) || 0), sections = Math.max(0, Number(maxSections) || 0);
    if (!courses || !sections) { toast.error(ar ? "ضع حدًا أكبر من صفر للمواد والشعب" : "Set limits greater than zero"); return; }
    setLoading(true);
    const { error } = await supabase.from("course_alert_entitlements").upsert({ user_id: selectedUser, enabled: true, max_courses: courses, max_sections: sections, expires_at: expiresAt ? new Date(`${expiresAt}T23:59:59`).toISOString() : null, notes: notes.trim() || null });
    if (error) toast.error(ar ? "تعذر منح صلاحية التنبيهات" : "Unable to grant alert access");
    else { toast.success(ar ? "تم منح/تحديث صلاحية التنبيهات" : "Alert access granted/updated"); setResults([]); setSelectedUser(""); setQuery(""); setNotes(""); await load(); }
    setLoading(false);
  };

  const update = async (userId: string, patch: Record<string, any>) => {
    const { error } = await supabase.from("course_alert_entitlements").update(patch).eq("user_id", userId);
    if (error) toast.error(ar ? "فشل تحديث الاشتراك" : "Failed to update entitlement"); else { toast.success(ar ? "تم تحديث الاشتراك" : "Entitlement updated"); load(); }
  };

  const revoke = async (userId: string) => {
    const { error } = await supabase.from("course_alert_entitlements").delete().eq("user_id", userId);
    if (error) toast.error(ar ? "فشل إلغاء الصلاحية" : "Failed to revoke access"); else { toast.success(ar ? "تم إلغاء الصلاحية وحذف الإعداد" : "Access revoked"); load(); }
  };

  return <section className="space-y-6 rounded-3xl border border-amber-300/20 bg-[#0f1e33] p-6 text-foreground">
    <div className="flex items-start gap-3"><div className="rounded-2xl bg-amber-300/10 p-3 text-amber-300"><ShieldCheck className="h-6 w-6" /></div><div><h3 className="text-lg font-black">{ar ? "اشتراكات تنبيهات الشعب" : "Section alert subscriptions"}</h3><p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">{ar ? "امنح الخاصية لحسابات محددة وحدد عدد المواد وعدد الشعب المسموح بمتابعتها." : "Grant the feature to selected accounts and set course and section limits."}</p></div></div>
    <div className="grid gap-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4 md:grid-cols-[1fr_auto]">
      <div><label className="mb-2 block text-xs font-black">{ar ? "البحث عبر Gmail" : "Search by Gmail"}</label><div className="flex gap-2"><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} placeholder="student@gmail.com" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0c192b] px-3 py-2.5 text-sm font-bold outline-none focus:border-amber-300/60" /><button onClick={search} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-black text-slate-950 disabled:opacity-50"><Search className="h-4 w-4" />{ar ? "بحث" : "Search"}</button></div>{results.length > 0 && <div className="mt-3 space-y-2">{results.map(result => <button key={result.user_id} onClick={() => setSelectedUser(result.user_id)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-black ${selectedUser === result.user_id ? "bg-amber-300 text-slate-950" : "bg-white/5 hover:bg-white/10"}`}><span>{result.email}</span><span>{selectedUser === result.user_id ? <Check className="h-4 w-4" /> : (ar ? "اختيار" : "Select")}</span></button>)}</div>}</div>
      <div className="grid grid-cols-2 gap-3 md:min-w-[340px]"><label className="text-xs font-black">{ar ? "عدد المواد" : "Courses"}<input type="number" min="1" value={maxCourses} onChange={e => setMaxCourses(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c192b] px-3 py-2.5 text-sm font-bold" /></label><label className="text-xs font-black">{ar ? "عدد الشعب" : "Sections"}<input type="number" min="1" value={maxSections} onChange={e => setMaxSections(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c192b] px-3 py-2.5 text-sm font-bold" /></label><label className="text-xs font-black">{ar ? "ينتهي في" : "Expires"}<input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c192b] px-3 py-2.5 text-sm font-bold" /></label><label className="text-xs font-black">{ar ? "ملاحظة" : "Note"}<input value={notes} onChange={e => setNotes(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c192b] px-3 py-2.5 text-sm font-bold" /></label></div>
      <button onClick={grant} disabled={loading || !selectedUser} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-40 md:col-start-2"><BellRing className="h-4 w-4" />{ar ? "منح الصلاحية" : "Grant access"}</button>
    </div>
    <div className="space-y-3"><div className="flex items-center gap-2 text-sm font-black"><BellRing className="h-4 w-4 text-amber-300" />{ar ? "الحسابات المصرح لها" : "Entitled accounts"}<span className="rounded-lg bg-white/10 px-2 py-1 text-[10px]">{items.length}</span></div>{items.length === 0 ? <p className="rounded-2xl border border-white/10 p-5 text-center text-xs font-bold text-muted-foreground">{ar ? "لا توجد حسابات مفعّلة حاليًا" : "No entitled accounts yet"}</p> : items.map(item => <div key={item.user_id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="min-w-0"><p className="truncate text-xs font-black">{item.user_id}</p><p className="mt-1 text-[11px] font-bold text-muted-foreground">{item.enabled ? (ar ? "مفعّل" : "Enabled") : (ar ? "موقوف" : "Disabled")} · {item.max_courses} {ar ? "مواد" : "courses"} · {item.max_sections} {ar ? "شعب" : "sections"}{item.expires_at ? ` · ${new Date(item.expires_at).toLocaleDateString()}` : ""}</p></div><div className="flex items-center gap-2"><button onClick={() => update(item.user_id, { enabled: !item.enabled })} className="rounded-xl border border-white/10 p-2 hover:bg-white/10" title={ar ? "تشغيل/إيقاف" : "Enable/disable"}><Power className={`h-4 w-4 ${item.enabled ? "text-emerald-300" : "text-red-300"}`} /></button><button onClick={() => revoke(item.user_id)} className="rounded-xl border border-red-300/20 p-2 text-red-300 hover:bg-red-300/10" title={ar ? "إلغاء" : "Revoke"}><Trash2 className="h-4 w-4" /></button></div></div>)}</div>
  </section>;
}
