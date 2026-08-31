import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Car, MapPin, Clock, Users, Plus, CheckCircle, XCircle, AlertCircle, Phone, Calendar, ChevronDown, ChevronUp, ArrowLeft, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

interface Ride {
  id: string;
  user_id: string;
  driver_name: string;
  phone: string;
  from_location: string;
  to_location: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: number;
  days: string[];
  notes: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface NewRide {
  driver_name: string;
  phone: string;
  from_location: string;
  to_location: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: number;
  days: string[];
  notes: string;
}

const defaultRide: NewRide = {
  driver_name: "",
  phone: "",
  from_location: "",
  to_location: "",
  departure_time: "07:30",
  available_seats: 3,
  price_per_seat: 1,
  days: [],
  notes: "",
};

export default function RideShare() {
  const { user } = useAuth();
  const { lang } = usePreferences();
  const ar = lang === "ar";

  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewRide>(defaultRide);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [activeTab, setActiveTab] = useState<"browse" | "my">("browse");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRides();
  }, [user]);

  async function fetchRides() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("ride_shares")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error && data) setRides(data);

    if (user) {
      const { data: mine } = await supabase
        .from("ride_shares")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (mine) setMyRides(mine);
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    if (form.days.length === 0) { toast.error("اختر يوماً واحداً على الأقل"); return; }
    if (!form.phone.trim()) { toast.error("رقم الهاتف مطلوب"); return; }

    setIsSubmitting(true);
    const { error } = await supabase.from("ride_shares").insert({
      ...form,
      user_id: user.id,
      status: "pending",
    });

    if (error) {
      toast.error("حدث خطأ، حاول مرة أخرى");
      console.error(error);
    } else {
      toast.success("تم إرسال طلب الرحلة بنجاح! سيتم مراجعته من قِبل الإدارة قريباً ✅");
      setShowForm(false);
      setForm(defaultRide);
      fetchRides();
    }
    setIsSubmitting(false);
  }

  function toggleDay(day: string) {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  }

  const statusBadge = (status: Ride["status"]) => {
    if (status === "approved") return <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg"><CheckCircle className="w-3 h-3" />مقبول</span>;
    if (status === "rejected") return <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg"><XCircle className="w-3 h-3" />مرفوض</span>;
    return <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg"><AlertCircle className="w-3 h-3" />قيد المراجعة</span>;
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 pt-24 pb-32 md:pb-20"
      dir="rtl"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#14B8A6]/20 to-[#14B8A6]/5 border border-[#14B8A6]/20 flex items-center justify-center shadow-inner">
            <Car className="w-7 h-7 text-[#14B8A6]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground">{ar ? "مرشد توصيل" : "Murshid Carpool"}</h1>
            <p className="text-sm md:text-base text-muted-foreground font-bold mt-1">{ar ? "مشاركة رحلات بين الطلاب" : "Student carpooling"}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4 bg-gradient-to-r from-[#14B8A6]/10 to-transparent border border-[#14B8A6]/10 rounded-2xl p-4 font-bold">
          🚗 {ar ? "عنده سيارة؟ أعلن عن رحلتك الصباحية وشارك التكلفة مع زملائك بسعر أقل من التاكسي!" : "Have a car? Post your morning trip and share the cost with classmates — cheaper than a taxi!"}
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="flex w-full sm:w-auto bg-surface p-1.5 rounded-2xl border border-border/50">
          <button
            onClick={() => setActiveTab("browse")}
            className={cn("flex-1 sm:px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300",
              activeTab === "browse"
                ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            استعرض الرحلات
          </button>
          {user && (
            <button
              onClick={() => setActiveTab("my")}
              className={cn("flex-1 sm:px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300",
                activeTab === "my"
                  ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              رحلاتي {myRides.length > 0 && <span className="bg-[#14B8A6]/10 text-[#14B8A6] px-2 py-0.5 rounded-lg text-xs ml-1">{myRides.length}</span>}
            </button>
          )}
        </div>
        
        {user && !showForm && activeTab === "browse" && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto sm:mr-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-emerald-400 text-white font-black text-sm hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#14B8A6]/20"
          >
            <Plus className="w-5 h-5" />
            أعلن عن رحلتك
          </button>
        )}
      </div>

      {!user && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2">سجّل دخولك لتتمكن من الإعلان عن رحلة</p>
          <Link to="/auth" className="inline-flex items-center gap-1 text-sm font-black text-[#14B8A6]">
            تسجيل الدخول <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Add Ride Form */}
      {showForm && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-card border border-border/50 rounded-3xl p-5 shadow-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black">إعلان رحلة جديدة</h2>
            <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-surface border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">اسمك الكريم *</span>
                <input
                  required
                  value={form.driver_name}
                  onChange={e => setForm(p => ({ ...p, driver_name: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors"
                  placeholder="مثال: أحمد خالد"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">رقم الهاتف (واتساب) *</span>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors text-left"
                  placeholder="07XXXXXXXX"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">نقطة الانطلاق *</span>
                <input
                  required
                  value={form.from_location}
                  onChange={e => setForm(p => ({ ...p, from_location: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors"
                  placeholder="مثال: شارع المدينة، الزرقاء"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">نقطة الوصول *</span>
                <input
                  required
                  value={form.to_location}
                  onChange={e => setForm(p => ({ ...p, to_location: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors"
                  placeholder="مثال: عمان، دوار الداخلية"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">وقت الانطلاق *</span>
                <input
                  required
                  type="time"
                  dir="ltr"
                  value={form.departure_time}
                  onChange={e => setForm(p => ({ ...p, departure_time: e.target.value }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors"
                />
              </label>
              <label className="block">
                <span className="text-xs font-black text-muted-foreground mb-1.5 block">المقاعد المتاحة</span>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={form.available_seats}
                  onChange={e => setForm(p => ({ ...p, available_seats: parseInt(e.target.value) }))}
                  className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-black text-muted-foreground mb-1.5 block">السعر لكل مقعد (دينار أردني)</span>
              <input
                type="number"
                min={0}
                step={0.25}
                value={form.price_per_seat}
                onChange={e => setForm(p => ({ ...p, price_per_seat: parseFloat(e.target.value) }))}
                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors"
              />
            </label>

            <div>
              <span className="text-xs font-black text-muted-foreground mb-2 block">أيام الرحلة *</span>
              <div className="flex flex-wrap gap-2">
                {DAYS_AR.map(day => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={cn("px-3 py-1.5 rounded-xl text-xs font-black transition-all",
                      form.days.includes(day)
                        ? "bg-[#14B8A6] text-white"
                        : "bg-surface border border-border/50 text-muted-foreground hover:border-[#14B8A6]/30"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-black text-muted-foreground mb-1.5 block">ملاحظات إضافية (اختياري)</span>
              <textarea
                rows={2}
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-colors resize-none"
                placeholder="مثال: نقطة التجمع عند دوار السابع الساعة 7:30"
              />
            </label>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ⚠️ سيتم مراجعة إعلانك من الإدارة قبل نشره للطلاب. عادةً خلال 24 ساعة.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-2xl bg-surface border border-border/50 font-black text-sm hover:bg-white/5 transition-all">
                إلغاء
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white font-black text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg">
                {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب ✓"}
              </button>
            </div>
          </form>
        </m.div>
      )}

      {/* Browse Rides */}
      {activeTab === "browse" && (
        <div className="space-y-4">
          <div className="relative mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن منطقة (مثال: عمان، الزرقاء...)"
              className="w-full bg-surface border border-border/50 rounded-2xl pl-4 pr-12 py-3.5 text-sm font-bold focus:outline-none focus:border-[#14B8A6] transition-all hover:border-border"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60">
              <Search className="w-5 h-5 text-[#14B8A6]" />
            </div>
          </div>

          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-3xl bg-card border border-border/50 animate-pulse" />
            ))
          ) : rides.filter(r => r.from_location.includes(searchTerm) || r.to_location.includes(searchTerm)).length === 0 ? (
            <m.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/30 border border-border/40 rounded-[2rem] border-dashed"
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-[#14B8A6]/5 flex items-center justify-center border border-[#14B8A6]/10">
                <Car className="w-10 h-10 text-[#14B8A6]/40" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">لا توجد رحلات متاحة حالياً</h3>
              <p className="text-sm font-bold text-muted-foreground max-w-xs mb-8 leading-relaxed">
                لم يقم أحد بالإعلان عن رحلة تطابق بحثك. كن أول من يشارك رحلته مع زملائه!
              </p>
              {user && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6] font-black text-sm hover:bg-[#14B8A6]/20 transition-all active:scale-[0.98]"
                >
                  <Plus className="w-5 h-5" />
                  أعلن عن رحلتك الآن
                </button>
              )}
            </m.div>
          ) : (
            rides.filter(r => r.from_location.includes(searchTerm) || r.to_location.includes(searchTerm)).map(ride => (
              <m.div
                key={ride.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-[#14B8A6]/30 hover:shadow-xl hover:shadow-[#14B8A6]/5 transition-all duration-300"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14B8A6]/20 to-[#14B8A6]/5 border border-[#14B8A6]/20 flex items-center justify-center shrink-0">
                        <Car className="w-6 h-6 text-[#14B8A6]" />
                      </div>
                      <div>
                        <p className="font-black text-foreground text-base sm:text-lg">{ride.driver_name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-[#14B8A6]" />
                          <span className="text-xs sm:text-sm font-bold text-muted-foreground" dir="ltr">{ride.departure_time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left shrink-0 bg-[#14B8A6]/5 px-3 py-2 rounded-2xl border border-[#14B8A6]/10 flex flex-col items-center justify-center">
                      <p className="text-lg sm:text-xl font-black text-[#14B8A6] leading-none">{ride.price_per_seat}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-bold mt-1">د.أ / مقعد</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm font-bold text-foreground mb-5 bg-surface/50 p-3.5 rounded-2xl border border-border/40">
                    <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="truncate text-sm">{ride.from_location}</span>
                    </div>
                    <div className="hidden sm:flex text-muted-foreground/30">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                    <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
                      <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="truncate text-sm">{ride.to_location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ride.days.map(day => (
                        <span key={day} className="text-[10px] sm:text-xs font-black bg-surface border border-border/50 text-muted-foreground px-2.5 py-1 rounded-xl">{day}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-muted-foreground bg-surface px-3 py-1.5 rounded-xl border border-border/50">
                      <Users className="w-4 h-4 text-[#14B8A6]" />
                      <span>{ride.available_seats} مقاعد</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(expandedId === ride.id ? null : ride.id)}
                    className="w-full mt-5 py-2.5 rounded-xl bg-surface/50 flex items-center justify-center gap-1.5 text-xs font-black text-muted-foreground hover:bg-surface hover:text-[#14B8A6] transition-all"
                  >
                    {expandedId === ride.id ? (<><ChevronUp className="w-4 h-4" />إخفاء التفاصيل</>) : (<><ChevronDown className="w-4 h-4" />عرض التفاصيل والتواصل</>)}
                  </button>

                  {expandedId === ride.id && (
                    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      {ride.notes && (
                        <p className="text-sm font-bold text-muted-foreground bg-surface rounded-xl px-3 py-2">{ride.notes}</p>
                      )}
                      <a
                        href={`https://wa.me/962${ride.phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-black text-sm hover:bg-[#25D366]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <Phone className="w-5 h-5" />
                        تواصل عبر واتساب: {ride.phone}
                      </a>
                    </m.div>
                  )}
                </div>
              </m.div>
            ))
          )}
        </div>
      )}

      {/* My Rides Tab */}
      {activeTab === "my" && user && (
        <div className="space-y-4">
          {myRides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card/30 border border-border/40 rounded-[2rem] border-dashed">
              <div className="w-20 h-20 mb-6 rounded-full bg-[#14B8A6]/5 flex items-center justify-center border border-[#14B8A6]/10">
                <Car className="w-8 h-8 text-[#14B8A6]/40" />
              </div>
              <p className="text-lg font-black text-foreground mb-4">لم تقم بالإعلان عن أي رحلة بعد</p>
              <button onClick={() => { setActiveTab("browse"); setShowForm(true); }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6] font-black text-sm hover:bg-[#14B8A6]/20 transition-all active:scale-[0.98]">
                <Plus className="w-5 h-5" />
                أضف رحلتك الأولى الآن
              </button>
            </div>
          ) : (
            myRides.map(ride => (
              <div key={ride.id} className="bg-card border border-border/50 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black">{ride.from_location}</p>
                  {statusBadge(ride.status)}
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ride.departure_time}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ride.available_seats} مقاعد</span>
                  <span>{ride.price_per_seat} د.أ</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {ride.days.map(day => (
                    <span key={day} className="text-[10px] font-black bg-surface border border-border/50 px-2 py-0.5 rounded-lg">{day}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </m.div>
  );
}
