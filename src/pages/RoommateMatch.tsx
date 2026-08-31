import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Home, Bed, Sofa, Package, Plus, XCircle, CheckCircle, AlertCircle, Phone, ArrowLeft, ChevronDown, ChevronUp, Search, MapPin } from "lucide-react";
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

const SLEEP_TIME_AR = ["نوم مبكر", "نوم متأخر", "عشوائي"];
const SLEEP_TIME_EN = ["Early bird", "Night owl", "Flexible"];
const STUDY_STYLE_AR = ["هدوء تام", "موسيقى/صوت", "دراسة جماعية"];
const STUDY_STYLE_EN = ["Quiet", "With noise/music", "Group study"];
const SMOKING_AR = ["مدخن", "غير مدخن", "لا يهم"];
const SMOKING_EN = ["Smoker", "Non-smoker", "Doesn't matter"];
const GENDER_AR = ["مطلوب شباب", "مطلوب بنات"];
const GENDER_EN = ["Male roommate", "Female roommate"];

const defaultForm = {
  name: "", phone: "", major: "غير محدد", academic_year: "1",
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
  const [filters, setFilters] = useState({ gender: "", smoking: "" });
  const [searchTerm, setSearchTerm] = useState("");

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
    if (searchTerm && !p.location_pref.includes(searchTerm) && !p.notes?.includes(searchTerm)) return false;
    return true;
  });

  const Field = ({ label, value, onChange, options, optionsAr, optionsEn }: any) => (
    <label className="block">
      <span className="text-xs font-black text-muted-foreground mb-1.5 block">{label} *</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors">
        <option value="" className="bg-[#0D0D0D] text-white">{ar ? "اختر..." : "Select..."}</option>
        {(ar ? optionsAr : optionsEn).map((opt: string, i: number) => (
          <option key={opt} value={ar ? optionsAr[i] : optionsEn[i]} className="bg-[#0D0D0D] text-white">{opt}</option>
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
            <p className="text-sm text-muted-foreground font-bold">{ar ? "إعلانات السكن والبحث عن شقق" : "Housing ads and apartment search"}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3 bg-violet-500/5 border border-violet-500/20 rounded-2xl p-4 font-bold">
          🏠 {ar ? "ابحث عن شريك السكن المثالي أو أعلن عن توفر مكان في سكنك!" : "Find the perfect roommate or announce an available spot in your housing!"}
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
            {tab === "browse" ? (ar ? "استعرض الإعلانات" : "Browse Ads") : (ar ? "إعلاني" : "My Ad")}
          </button>
        ))}
      </div>

      {/* Add Profile Button */}
      {user && !showForm && activeTab === "browse" && !myProfile && (
        <button onClick={() => setShowForm(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-black text-sm hover:opacity-90 transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          {ar ? "أضف إعلان شريك سكن" : "Add Roommate Ad"}
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
            <h2 className="text-lg font-black">{ar ? "تفاصيل البحث عن شريك سكن" : "Roommate Search Details"}</h2>
            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-surface border border-border/50 flex items-center justify-center text-muted-foreground">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "اسم المُعلن *" : "Advertiser Name *"}</span>
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
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "موقع السكن (المدينة/المنطقة) *" : "Location *"}</span>
                <input required value={form.location_pref} onChange={e => setForm(p => ({ ...p, location_pref: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors"
                  placeholder={ar ? "مثال: عمان، شفا بدران أو بجانب البوابة الشمالية" : "e.g. Amman, Shafa Badran"} />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={ar ? "الجنس المطلوب" : "Required Gender"} value={form.gender} onChange={(v: string) => setForm(p => ({ ...p, gender: v }))} optionsAr={GENDER_AR} optionsEn={GENDER_EN} />
              <Field label={ar ? "طبيعة النوم" : "Sleep Schedule"} value={form.sleep_time} onChange={(v: string) => setForm(p => ({ ...p, sleep_time: v }))} optionsAr={SLEEP_TIME_AR} optionsEn={SLEEP_TIME_EN} />
              <Field label={ar ? "جو الدراسة" : "Study Environment"} value={form.study_style} onChange={(v: string) => setForm(p => ({ ...p, study_style: v }))} optionsAr={STUDY_STYLE_AR} optionsEn={STUDY_STYLE_EN} />
              <Field label={ar ? "التدخين" : "Smoking"} value={form.smoking} onChange={(v: string) => setForm(p => ({ ...p, smoking: v }))} optionsAr={SMOKING_AR} optionsEn={SMOKING_EN} />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">{ar ? "الإيجار الشهري (د.أ)" : "Monthly Rent (JOD)"}</span>
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
          ].map(f => (
            <select key={f.key} value={(filters as any)[f.key]}
              onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
              className="bg-card border border-border/50 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-violet-400 transition-colors">
              <option value="" className="bg-[#0D0D0D] text-white">{ar ? f.ar : f.en}: {ar ? "الكل" : "All"}</option>
              {f.options.map(o => <option key={o} value={o} className="bg-[#0D0D0D] text-white">{o}</option>)}
            </select>
          ))}
        </div>
      )}

      {/* Browse */}
      {activeTab === "browse" && (
        <div className="space-y-4">
          <div className="relative mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={ar ? "ابحث عن منطقة (مثال: عمان...)" : "Search location (e.g. Amman...)"}
              className="w-full bg-surface border border-border/50 rounded-2xl pl-4 pr-12 py-3.5 text-sm font-bold focus:outline-none focus:border-violet-400 transition-colors shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="w-5 h-5 text-violet-400" />
            </div>
          </div>

          {isLoading ? [1,2,3].map(i => <div key={i} className="h-36 rounded-3xl bg-card border border-border/50 animate-pulse" />)
          : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-black text-muted-foreground">{ar ? "لا يوجد إعلانات حالياً" : "No ads yet"}</p>
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
                      <p className="text-xs text-muted-foreground font-bold flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {p.location_pref}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-violet-400 bg-violet-500/10 px-2 py-1 rounded-lg shrink-0">{p.gender}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { icon: Bed, value: p.sleep_time },
                    { icon: Sofa, value: p.study_style },
                    { icon: Package, value: p.smoking },
                  ].map(({ icon: Icon, value }, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-surface border border-border/40 rounded-xl px-2 py-1.5">
                      <Icon className="w-3 h-3 text-violet-400 shrink-0" />
                      <span className="text-[10px] font-bold text-muted-foreground truncate">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span />
                  {p.budget && <span className="text-[#14B8A6] font-black text-sm">{p.budget} {ar ? "د.أ شهرياً" : "JOD / mo"}</span>}
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
              <p className="text-sm font-bold text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4"/> {myProfile.location_pref}</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold mt-2">
                <span className="bg-surface rounded-xl px-3 py-2 flex items-center gap-2"><Bed className="w-4 h-4 text-violet-400"/> {myProfile.sleep_time}</span>
                <span className="bg-surface rounded-xl px-3 py-2 flex items-center gap-2"><Sofa className="w-4 h-4 text-violet-400"/> {myProfile.study_style}</span>
                <span className="bg-surface rounded-xl px-3 py-2 flex items-center gap-2"><Package className="w-4 h-4 text-violet-400"/> {myProfile.smoking}</span>
                <span className="bg-surface rounded-xl px-3 py-2 flex items-center gap-2 text-[#14B8A6]">{myProfile.budget ? `${myProfile.budget} د.أ` : "غير محدد"}</span>
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
