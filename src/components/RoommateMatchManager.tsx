import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2, RefreshCw, Home, Moon, BookOpen, Cigarette, Power } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Profile { id: string; user_id: string; name: string; phone: string; major: string; academic_year: string; sleep_time: string; study_style: string; smoking: string; gender: string; location_pref: string; budget: string; notes: string | null; status: "pending" | "approved" | "rejected"; created_at: string; }

export default function RoommateMatchManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [isPageEnabled, setIsPageEnabled] = useState(true);

  useEffect(() => { fetch(); fetchPageState(); }, []);

  async function fetchPageState() {
    const { data } = await supabase.from('maintenance_mode').select('is_active').eq('page_id', 'roommate').maybeSingle();
    setIsPageEnabled(!data?.is_active);
  }

  async function togglePageStatus() {
    const newStatus = !isPageEnabled;
    const { error } = await supabase.from('maintenance_mode').upsert({
      page_id: 'roommate', is_active: !newStatus, updated_at: new Date().toISOString()
    });
    if (error) toast.error("فشل تحديث الحالة");
    else {
      setIsPageEnabled(newStatus);
      toast.success(newStatus ? "تم تفعيل الصفحة للطلاب" : "تم إخفاء الصفحة عن الطلاب");
    }
  }

  async function fetch() {
    setLoading(true);
    const { data } = await supabase.from("roommate_profiles").select("*").order("created_at", { ascending: false });
    if (data) setProfiles(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    const { error } = await supabase.from("roommate_profiles").update({ status }).eq("id", id);
    if (error) toast.error("فشل التحديث");
    else { toast.success(status === "approved" ? "✅ تم قبول الملف ونشره" : "❌ تم رفض الملف"); fetch(); }
  }

  async function del(id: string) {
    const { error } = await supabase.from("roommate_profiles").delete().eq("id", id);
    if (error) toast.error("فشل الحذف"); else { toast.success("تم الحذف"); fetch(); }
  }

  const filtered = filter === "all" ? profiles : profiles.filter(p => p.status === filter);
  const counts = { all: profiles.length, pending: profiles.filter(p => p.status === "pending").length, approved: profiles.filter(p => p.status === "approved").length, rejected: profiles.filter(p => p.status === "rejected").length };

  if (loading) return <div className="flex justify-center py-16"><RefreshCw className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-violet-400" />
          <h3 className="font-black text-lg">إدارة مرشد سكني</h3>
        </div>
        <button onClick={fetch} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border/50 text-xs font-black hover:border-primary/30 transition-all">
          <RefreshCw className="w-3.5 h-3.5" />تحديث
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between bg-surface border border-border/50 p-4 rounded-2xl gap-4">
        <div>
          <h4 className="font-black text-lg">حالة صفحة مرشد سكني</h4>
          <p className="text-xs text-muted-foreground font-bold">عند الإيقاف، ستختفي الصفحة من القائمة الجانبية للطلاب.</p>
        </div>
        <button onClick={togglePageStatus} className={cn("px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 text-white shrink-0", isPageEnabled ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20" : "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20")}>
          <Power className="w-4 h-4 shrink-0" />
          {isPageEnabled ? "إيقاف وإخفاء الصفحة" : "تفعيل وإظهار الصفحة"}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-4 py-2 rounded-xl text-xs font-black transition-all border",
              filter === f ? "bg-violet-500 text-white border-violet-500" : "bg-surface border-border/50 text-muted-foreground hover:border-violet-400/30")}>
            {f === "pending" && `⏳ قيد المراجعة (${counts.pending})`}
            {f === "approved" && `✅ مقبول (${counts.approved})`}
            {f === "rejected" && `❌ مرفوض (${counts.rejected})`}
            {f === "all" && `📋 الكل (${counts.all})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><Home className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="font-bold">لا توجد ملفات في هذه الفئة</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className={cn("bg-card border rounded-2xl p-4 space-y-3 transition-all",
              p.status === "pending" && "border-amber-500/30 bg-amber-500/5",
              p.status === "approved" && "border-emerald-500/20",
              p.status === "rejected" && "border-red-500/20 opacity-70")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black">{p.name}</p>
                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-lg",
                      p.status === "pending" && "bg-amber-500/20 text-amber-500",
                      p.status === "approved" && "bg-emerald-500/20 text-emerald-500",
                      p.status === "rejected" && "bg-red-500/20 text-red-500")}>
                      {p.status === "pending" ? "قيد المراجعة" : p.status === "approved" ? "مقبول" : "مرفوض"}
                    </span>
                    <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-lg font-black">{p.gender}</span>
                  </div>
                  <p className="text-xs font-bold text-muted-foreground">{p.major} — السنة {p.academic_year} | 📞 {p.phone}</p>
                </div>
                {p.budget && <p className="font-black text-violet-400 shrink-0">{p.budget} د.أ</p>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-bold text-muted-foreground">
                <div className="flex items-center gap-1 bg-surface rounded-xl px-2 py-1.5"><Moon className="w-3 h-3 text-violet-400 shrink-0" /><span className="truncate">{p.sleep_time}</span></div>
                <div className="flex items-center gap-1 bg-surface rounded-xl px-2 py-1.5"><BookOpen className="w-3 h-3 text-violet-400 shrink-0" /><span className="truncate">{p.study_style}</span></div>
                <div className="flex items-center gap-1 bg-surface rounded-xl px-2 py-1.5"><Cigarette className="w-3 h-3 text-violet-400 shrink-0" /><span className="truncate">{p.smoking}</span></div>
                <div className="flex items-center gap-1 bg-surface rounded-xl px-2 py-1.5">📍<span className="truncate">{p.location_pref}</span></div>
              </div>
              {p.notes && <p className="text-xs font-bold text-muted-foreground bg-surface rounded-xl px-3 py-2">📝 {p.notes}</p>}
              <div className="flex items-center gap-2 pt-1 border-t border-border/30">
                {p.status !== "approved" && (
                  <button onClick={() => updateStatus(p.id, "approved")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-xs hover:bg-emerald-500/20 transition-all">
                    <CheckCircle className="w-4 h-4" />قبول ونشر
                  </button>
                )}
                {p.status !== "rejected" && (
                  <button onClick={() => updateStatus(p.id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs hover:bg-red-500/20 transition-all">
                    <XCircle className="w-4 h-4" />رفض
                  </button>
                )}
                <button onClick={() => del(p.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-border/50 text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
