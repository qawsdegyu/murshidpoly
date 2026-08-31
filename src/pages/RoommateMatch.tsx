import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Home, Moon, BookOpen, Cigarette, GraduationCap, Plus, XCircle, CheckCircle, AlertCircle, Phone, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  major: string;
  academic_year: string;
  sleep_time: string;
  study_style: string;
  smoking: string;
  gender: string;
  location_pref: string;
  budget: string;
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const SLEEP_OPTIONS_AR = ["مبكر (قبل 11)", "متأخر (بعد 12)", "مرن"];
const SLEEP_OPTIONS_EN = ["Early (before 11 PM)", "Late (after midnight)", "Flexible"];
const STUDY_OPTIONS_AR = ["في الغرفة", "في المكتبة", "مرن"];
const STUDY_OPTIONS_EN = ["In the room", "In the library", "Flexible"];
const SMOKING_AR = ["غير مدخن", "مدخن", "لا يهم"];
const SMOKING_EN = ["Non-smoker", "Smoker", "Doesn't matter"];
const GENDER_AR = ["ذكر", "أنثى"];
const GENDER_EN = ["Male", "Female"];
const LOCATION_AR = ["داخل الحرم", "قريب من الجامعة", "أي مكان"];
const LOCATION_EN = ["On campus", "Near university", "Anywhere"];

const defaultForm = {
  name: "", phone: "", major: "", academic_year: "1",
  sleep_time: "", study_style: "", smoking: "", gender: "",
  location_pref: "", budget: "", notes: "",
};

export default function RoommateMatch() {
  const { user } = useAuth();
  const { lang } = usePreferences();
  const ar = lang === "ar";

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<"browse" | "my">("browse");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ gender: "", smoking: "", location_pref: "" });

  useEffect(() => { fetchProfiles(); }, [user]);

  async function fetchProfiles() {
    setIsLoading(true);
    const { data } = await supabase.from("roommate_profiles").select("*").eq("status", "approved").order("created_at", { ascending: false });
    if (data) setProfiles(data);
    if (user) {
      const { data: mine } = await supabase.from("roommate_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (mine) setMyProfile(mine);
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { toast.error(ar ? "يجب تسجيل الدخول" : "Please sign in first"); return; }
    if (!form.sleep_time || !form.study_style || !form.smoking || !form.gender) {
      toast.error(ar ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill all required fields"); return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("roommate_profiles").upsert({ ...form, user_id: user.id, status: "pending" }, { onConflict: "user_id" });
    if (error) toast.error(ar ? "حدث خطأ" : "An error occurred");
    else {
      toast.success(ar ? "تم إرسال ملفك! سيتم مراجعته قريباً ✅" : "Profile submitted! It will be reviewed shortly ✅");
      setShowForm(false); fetchProfiles();
    }
    setIsSubmitting(false);
  }

  const filtered = profiles.filter(p => {
    if (filters.gender && p.gender !== filters.gender) return false;
    if (filters.smoking && p.smoking !== filters.smoking) return false;
    if (filters.location_pref && p.location_pref !== filters.location_pref) return false;
    return true;
  });

  const Field = ({ label, value, onChange, options, optionsAr, optionsEn }: any) => (
    <label className="block">
      <span className="text-xs font-black text-muted-foreground mb-1.5 block">{label} *</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors">
        <option value="">{ar ? "اختر..." : "Select..."}</option>
        {(ar ? optionsAr : optionsEn).map((opt: string, i: number) => (
          <option key={opt} value={ar ? optionsAr[i] : optionsEn[i]}>{opt}</option>
        ))}
      </select>
    </label>
  );

  const statusBadge = (status: Profile["status"]) => {
    if (status === "approved") return <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg"><CheckCircle className="w-3 h-3" />{ar ? "مقبول" : "Approved"}</span>;
    if (status === "rejected") return <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg"><XCircle className="w-3 h-3" />{ar ? "مرفوض" : "Rejected"}</span>;
    return <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg"><AlertCircle className="w-3 h-3" />{ar ? "قيد المراجعة" : "Pending"}</span>;
  };

  return (
    <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4 pt-24 pb-32 md:pb-20" dir={ar ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
            <Home className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">{ar ? "مرشد سكني" : "Murshid Housing"}</h1>
            <p className="text-sm text-muted-foreground font-bold">{ar ? "ابحث عن رفيق السكن المثالي" : "Find your ideal roommate"}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 bg-violet-500/5 border border-violet-500/20 rounded-2xl p-4 font-bold">
          🏠 {ar ? "أضف ملفك الشخصي وتعرف على طلاب يشاركونك نفس العادات والتخصص!" : "Add your profile and meet students who share your habits and major!"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["browse", "my"] as const).map(tab => (
          (tab === "my" && !user) ? null :
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("flex-1 py-2.5 rounded-xl font-black text-sm transition-all",
              activeTab === tab ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" : "bg-card border border-border/50 text-muted-foreground hover:border-violet-500/30"
            )}>
            {tab === "browse" ? (ar ? "استعرض الطلاب" : "Browse Students") : (ar ? "ملفي" : "My Profile")}
          </button>
        ))}
      </div>

      {/* Add Profile Button */}
      {user && !showForm && activeTab === "browse" && !myProfile && (
        <button onClick={() => setShowForm(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-black text-sm hover:opacity-90 transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          {ar ? "أضف ملفك الشخصي" : "Add Your Profile"}
        </button>
      )}

      {!user && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-sm font-bold text-amber-500 mb-2">{ar ? "سجّل دخولك لإضافة ملفك" : "Sign in to add your profile"}</p>
          <Link to="/auth" className="inline-flex items-center gap-1 text-sm font-black text-violet-400">
            {ar ? "تسجيل الدخول" : "Sign In"} <ArrowLeft className={cn("w-4 h-4", ar && "rotate-180")} />
          </Link>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-card border border-border/50 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black">{ar ? "ملفك الشخصي للسكن" : "Your Housing Profile"}</h2>
            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-surface border border-border/50 flex items-center justify-center text-muted-foreground">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "اسمك *" : "Your Name *"}</span>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors"
                  placeholder={ar ? "مثال: محمد أحمد" : "e.g. Mohammad Ahmad"} />
              </label>
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "واتساب *" : "WhatsApp *"}</span>
                <input required type="tel" dir="ltr" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors text-left"
                  placeholder="07XXXXXXXX" />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "التخصص *" : "Major *"}</span>
                <input required value={form.major} onChange={e => setForm(p => ({ ...p, major: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors"
                  placeholder={ar ? "مثال: هندسة حاسوب" : "e.g. Computer Engineering"} />
              </label>
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "السنة الدراسية *" : "Academic Year *"}</span>
                <select value={form.academic_year} onChange={e => setForm(p => ({ ...p, academic_year: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors">
                  {["1","2","3","4"].map(y => <option key={y} value={y}>{ar ? `السنة ${y}` : `Year ${y}`}</option>)}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={ar ? "وقت النوم" : "Sleep Time"} value={form.sleep_time} onChange={(v: string) => setForm(p => ({ ...p, sleep_time: v }))} optionsAr={SLEEP_OPTIONS_AR} optionsEn={SLEEP_OPTIONS_EN} />
              <Field label={ar ? "أسلوب الدراسة" : "Study Style"} value={form.study_style} onChange={(v: string) => setForm(p => ({ ...p, study_style: v }))} optionsAr={STUDY_OPTIONS_AR} optionsEn={STUDY_OPTIONS_EN} />
              <Field label={ar ? "التدخين" : "Smoking"} value={form.smoking} onChange={(v: string) => setForm(p => ({ ...p, smoking: v }))} optionsAr={SMOKING_AR} optionsEn={SMOKING_EN} />
              <Field label={ar ? "الجنس" : "Gender"} value={form.gender} onChange={(v: string) => setForm(p => ({ ...p, gender: v }))} optionsAr={GENDER_AR} optionsEn={GENDER_EN} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={ar ? "موقع السكن المفضل" : "Preferred Location"} value={form.location_pref} onChange={(v: string) => setForm(p => ({ ...p, location_pref: v }))} optionsAr={LOCATION_AR} optionsEn={LOCATION_EN} />
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "الميزانية الشهرية (د.أ)" : "Monthly Budget (JOD)"}</span>
                <input type="number" min={0} value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors"
                  placeholder={ar ? "مثال: 150" : "e.g. 150"} />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "ملاحظات إضافية" : "Additional Notes"}</span>
              <textarea rows={2} value={form.notes ?? ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors resize-none"
                placeholder={ar ? "أي تفاصيل إضافية عن نفسك..." : "Any additional details about yourself..."} />
            </label>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ⚠️ {ar ? "سيتم مراجعة ملفك من الإدارة قبل نشره. عادةً خلال 24 ساعة." : "Your profile will be reviewed before publishing. Usually within 24 hours."}
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-2xl bg-surface border border-border/50 font-black text-sm hover:bg-white/5 transition-all">
                {ar ? "إلغاء" : "Cancel"}
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-black text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg">
                {isSubmitting ? (ar ? "جاري الإرسال..." : "Submitting...") : (ar ? "إرسال ✓" : "Submit ✓")}
              </button>
            </div>
          </form>
        </m.div>
      )}

      {/* Filters */}
      {activeTab === "browse" && (
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { key: "gender", ar: "الجنس", en: "Gender", options: ar ? GENDER_AR : GENDER_EN },
            { key: "smoking", ar: "التدخين", en: "Smoking", options: ar ? SMOKING_AR : SMOKING_EN },
            { key: "location_pref", ar: "الموقع", en: "Location", options: ar ? LOCATION_AR : LOCATION_EN },
          ].map(f => (
            <select key={f.key} value={(filters as any)[f.key]}
              onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
              className="bg-card border border-border/50 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-violet-400 transition-colors">
              <option value="">{ar ? f.ar : f.en}: {ar ? "الكل" : "All"}</option>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
      )}

      {/* Browse */}
      {activeTab === "browse" && (
        <div className="space-y-4">
          {isLoading ? [1,2,3].map(i => <div key={i} className="h-36 rounded-3xl bg-card border border-border/50 animate-pulse" />)
          : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-black text-muted-foreground">{ar ? "لا يوجد طلاب حالياً" : "No students yet"}</p>
            </div>
          ) : filtered.map(p => (
            <m.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-black">{p.name}</p>
                      <p className="text-xs text-muted-foreground font-bold">{p.major} — {ar ? `السنة ${p.academic_year}` : `Year ${p.academic_year}`}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-violet-400 bg-violet-500/10 px-2 py-1 rounded-lg shrink-0">{p.gender}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { icon: Moon, value: p.sleep_time },
                    { icon: BookOpen, value: p.study_style },
                    { icon: Cigarette, value: p.smoking },
                  ].map(({ icon: Icon, value }, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-surface border border-border/40 rounded-xl px-2 py-1.5">
                      <Icon className="w-3 h-3 text-violet-400 shrink-0" />
                      <span className="text-[10px] font-bold text-muted-foreground truncate">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>📍 {p.location_pref}</span>
                  {p.budget && <span>💰 {p.budget} {ar ? "د.أ" : "JOD"}</span>}
                </div>
                <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  className="w-full mt-3 flex items-center justify-center gap-1 text-xs font-bold text-muted-foreground hover:text-violet-400 transition-colors">
                  {expandedId === p.id ? <><ChevronUp className="w-3.5 h-3.5" />{ar ? "إخفاء" : "Hide"}</> : <><ChevronDown className="w-3.5 h-3.5" />{ar ? "تواصل" : "Contact"}</>}
                </button>
                {expandedId === p.id && (
                  <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-border/50 space-y-2">
                    {p.notes && <p className="text-xs font-bold text-muted-foreground bg-surface rounded-xl px-3 py-2">{p.notes}</p>}
                    <a href={`https://wa.me/962${p.phone.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-black text-sm hover:bg-[#25D366]/20 transition-all">
                      <Phone className="w-4 h-4" />
                      {ar ? "تواصل عبر واتساب" : "Contact via WhatsApp"}: {p.phone}
                    </a>
                  </m.div>
                )}
              </div>
            </m.div>
          ))}
        </div>
      )}

      {/* My Profile */}
      {activeTab === "my" && user && (
        <div>
          {!myProfile ? (
            <div className="text-center py-16">
              <Home className="w-14 h-14 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-black text-muted-foreground">{ar ? "لم تضف ملفك بعد" : "No profile yet"}</p>
              <button onClick={() => { setActiveTab("browse"); setShowForm(true); }}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 font-black text-sm">
                <Plus className="w-4 h-4" />{ar ? "أضف ملفك" : "Add Profile"}
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border/50 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-black text-lg">{myProfile.name}</p>
                {statusBadge(myProfile.status)}
              </div>
              <p className="text-sm font-bold text-muted-foreground">{myProfile.major} — {ar ? `السنة ${myProfile.academic_year}` : `Year ${myProfile.academic_year}`}</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <span className="bg-surface rounded-xl px-3 py-2">🌙 {myProfile.sleep_time}</span>
                <span className="bg-surface rounded-xl px-3 py-2">📚 {myProfile.study_style}</span>
                <span className="bg-surface rounded-xl px-3 py-2">🚬 {myProfile.smoking}</span>
                <span className="bg-surface rounded-xl px-3 py-2">📍 {myProfile.location_pref}</span>
              </div>
              <button onClick={() => { setForm({ name: myProfile.name, phone: myProfile.phone, major: myProfile.major, academic_year: myProfile.academic_year, sleep_time: myProfile.sleep_time, study_style: myProfile.study_style, smoking: myProfile.smoking, gender: myProfile.gender, location_pref: myProfile.location_pref, budget: myProfile.budget, notes: myProfile.notes ?? "" }); setActiveTab("browse"); setShowForm(true); }}
                className="w-full py-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 font-black text-sm hover:bg-violet-500/20 transition-all">
                ✏️ {ar ? "تعديل ملفي" : "Edit Profile"}
              </button>
            </div>
          )}
        </div>
      )}
    </m.div>
  );
}
