import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Newspaper, MapPin, Clock, User, RefreshCw, Bell, BellRing,
  CheckCircle2, XCircle, Cpu, Settings, Building2, Zap, Beaker, Microscope, BookOpen
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import BrandedLoader from "@/components/BrandedLoader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CourseRow {
  code: string;
  name: string;
  section: string;
  instructor: string;
  time: string;
  room: string;
  status: string;
  dept: string;
}

const DEPARTMENTS = [
  { id: 'all', nameAr: 'الكل', nameEn: 'All', icon: Newspaper },
  { id: 'mechatronics', nameAr: 'ميكاترونيكس', nameEn: 'Mechatronics', icon: Cpu, emoji: '⚙️' },
  { id: 'mechanical', nameAr: 'ميكانيكية', nameEn: 'Mechanical', icon: Settings, emoji: '🔧' },
  { id: 'civil', nameAr: 'مدنية', nameEn: 'Civil', icon: Building2, emoji: '🏗️' },
  { id: 'electrical', nameAr: 'كهربائية', nameEn: 'Electrical', icon: Zap, emoji: '⚡' },
  { id: 'chemical', nameAr: 'كيميائية', nameEn: 'Chemical', icon: Beaker, emoji: '⚗️' },
  { id: 'science', nameAr: 'علوم', nameEn: 'Basic Sciences', icon: Microscope, emoji: '🔬' },
  { id: 'humanities', nameAr: 'إنسانية', nameEn: 'Humanities', icon: BookOpen, emoji: '📚' },
];

export default function CourseNewspaper() {
  const { lang } = usePreferences();
  const isAr = lang === 'ar';
  
  const [activeDept, setActiveDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);
    setLoadError(null);
    try {
      const [{ data: snapshot, error }, { data: departments }] = await Promise.all([
        supabase
          .from('university_courses')
          .select('id,course_no,name,section_no,status,rooms,times,lecturers,department_id,last_updated')
          .order('course_no', { ascending: true })
          .order('section_no', { ascending: true }),
        supabase.from('departments').select('id,name').limit(500)
      ]);

      if (error) throw error;

      const departmentNames: Record<string, string> = {};
      (departments || []).forEach((department: any) => {
        departmentNames[String(department.id)] = String(department.name || '');
      });

      const dayChars: Record<string, string> = { 'ح': 'ح', 'ن': 'ن', 'ث': 'ث', 'ر': 'ر', 'خ': 'خ' };
      const isCancelled = (status: unknown) => {
        const normalized = String(status ?? '').trim().toLowerCase();
        return normalized === '2' || normalized === 'ملغاة' || normalized === 'ملغى' || normalized === 'cancelled' || normalized === 'canceled';
      };
      const displayStatus = (status: unknown) => {
        const normalized = String(status ?? '').trim().toLowerCase();
        return normalized === '3' || normalized === 'مغلقة' || normalized === 'مغلق' || normalized === 'closed' ? 'مغلقة' : 'متاحة';
      };
      const departmentBucket = (departmentId: unknown) => {
        const id = String(departmentId ?? '');
        const name = (departmentNames[id] || '').toLowerCase();
        if (id === '7' || name.includes('ميكاتر') || name.includes('mechatronics')) return 'mechatronics';
        if (id === '3' || name.includes('ميكاني') || name.includes('mechanical')) return 'mechanical';
        if (id === '2' || name.includes('مدني') || name.includes('civil')) return 'civil';
        if (id === '1' || name.includes('كهرب') || name.includes('electrical')) return 'electrical';
        if (id === '4' || name.includes('كيمي') || name.includes('chemical')) return 'chemical';
        if (id === '5' || id === '14' || name.includes('علوم') || name.includes('science')) return 'science';
        if (id === '8' || name.includes('إنسان') || name.includes('human')) return 'humanities';
        return 'other';
      };
      const formatTime = (value: unknown) => {
        const raw = String(value ?? '').replace(/\s+/g, ' ').trim();
        if (!raw) return '—';
        const parts = raw.split(' ');
        const days = parts.filter((part) => dayChars[part]).join(' ');
        const times = parts.filter((part) => /^\d{1,2}:\d{2}$/.test(part));
        const timeText = times.length > 1 ? `${times[0]}–${times[1]}` : times[0] || '';
        return [days, timeText].filter(Boolean).join(' ') || raw;
      };

      const rows = (snapshot || [])
        .filter((item: any) => !isCancelled(item.status))
        .map((item: any): CourseRow => ({
          code: item.course_no || 'N/A',
          name: item.name || 'N/A',
          section: String(item.section_no || '1'),
          instructor: item.lecturers?.trim() || 'غير محدد',
          time: formatTime(item.times),
          room: item.rooms?.trim() || 'غير محدد',
          status: displayStatus(item.status),
          dept: departmentBucket(item.department_id)
        }));

      setData(rows);
      const timestamps = (snapshot || []).map((item: any) => item.last_updated).filter(Boolean).sort();
      setLastUpdated(timestamps[timestamps.length - 1] || null);
    } catch (err) {
      console.error('Error fetching official newspaper snapshot:', err);
      setLoadError(isAr ? 'تعذر تحميل جريدة الجامعة الحالية' : 'Unable to load the current university newspaper');
    } finally {
      if (showSpinner) setLoading(false);
      else setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const intervalId = window.setInterval(() => fetchData(false), 6 * 60 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesDept = activeDept === 'all' || item.dept === activeDept;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [activeDept, searchQuery, data]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      counts[item.dept] = (counts[item.dept] || 0) + 1;
    });
    return counts;
  }, [data]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        <PageHeader
          title={isAr ? "جريدة المواد الدراسية" : "Course Newspaper"}
          subtitle={isAr 
          ? "بيانات مباشرة من جريدة الجامعة الرسمية — تتجدد كل 6 ساعات." 
          : "Live data from the official university newspaper — refreshed every 6 hours."}
          icon={<Newspaper className="w-8 h-8 text-secondary" />}
        />
        <div className="mt-20 flex justify-center">
          <BrandedLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <PageHeader
        title={isAr ? "جريدة المواد الدراسية" : "Course Newspaper"}
        subtitle={isAr 
          ? "بيانات مباشرة من جريدة الجامعة الرسمية — تتجدد كل 6 ساعات." 
          : "Live data from the official university newspaper — refreshed every 6 hours."}
        icon={<Newspaper className="w-8 h-8 text-secondary" />}
      />

      {/* Toolbar */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-40 bg-background/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 w-full md:w-auto text-xs font-bold text-muted-foreground">
          <button
            type="button"
            onClick={() => fetchData(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-3 py-2 text-secondary transition-all hover:bg-secondary/20 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {isAr ? 'تحديث الآن' : 'Refresh now'}
          </button>
          <span>
            {loadError || (lastUpdated
              ? `${isAr ? 'آخر تحديث' : 'Last update'}: ${new Date(lastUpdated).toLocaleString(isAr ? 'ar-JO' : 'en-US')}`
              : (isAr ? 'المصدر الرسمي' : 'Official source'))}
          </span>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder={isAr ? "ابحث عن مادة، كود، أو محاضر..." : "Search course, code, or instructor..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border/50 rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-secondary/50 transition-all shadow-inner"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setActiveDept(dept.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap font-black text-xs",
                activeDept === dept.id
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-lg shadow-secondary/20 scale-105"
                  : "bg-surface border-border/50 text-muted-foreground hover:border-secondary/30 hover:text-foreground"
              )}
            >
              <dept.icon className="w-4 h-4" />
              {isAr ? dept.nameAr : dept.nameEn}
              {dept.id !== 'all' && (
                <span className="opacity-60 bg-black/10 px-1.5 rounded-md">{stats[dept.id] || 0}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content View */}
      <div className="mt-8">
        {filteredData.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-surface/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-secondary/10 border-b border-white/5">
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-secondary">{isAr ? "رقم المادة" : "Code"}</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-secondary">{isAr ? "اسم المادة" : "Course Name"}</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-secondary text-center">{isAr ? "ش" : "Sec"}</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-secondary">{isAr ? "المحاضر" : "Instructor"}</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-secondary">{isAr ? "الأوقات" : "Timing"}</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-secondary">{isAr ? "القاعة" : "Room"}</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-secondary text-center">{isAr ? "الحالة" : "Status"}</th>
                      <th className="p-6 text-xs font-black uppercase tracking-widest text-secondary text-center">{isAr ? "تنبيه" : "Alert"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {filteredData.map((course, idx) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={`${course.code}-${idx}`}
                          className="group hover:bg-white/5 transition-colors border-b border-white/5"
                        >
                          <td className="p-6">
                            <span className="bg-secondary/15 text-secondary px-3 py-1 rounded-lg text-xs font-black border border-secondary/20">
                              {course.section}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="text-base font-black text-foreground group-hover:text-secondary transition-colors">{course.name}</span>
                              <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-1">
                                {DEPARTMENTS.find(d => d.id === course.dept)?.emoji} {isAr ? DEPARTMENTS.find(d => d.id === course.dept)?.nameAr : DEPARTMENTS.find(d => d.id === course.dept)?.nameEn}
                              </span>
                            </div>
                          </td>
                          <td className="p-6 text-center">
                            <span className="text-lg font-black text-foreground/70">{course.hours}</span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                <User className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-bold text-foreground/80">{course.instructor}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-secondary/60" />
                              <span className="text-sm font-medium text-foreground/70" dir="ltr">{course.time}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-accent/60" />
                              <span className="text-sm font-medium text-foreground/70">{course.room}</span>
                            </div>
                          </td>
                          <td className="p-6 text-center">
                            {course.status === 'متاحة' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black border border-green-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                {course.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black border border-red-500/20">
                                <XCircle className="w-3 h-3" />
                                {course.status}
                              </span>
                            )}
                          </td>
                          <td className="p-6 text-center">
                            <SectionAlertButton courseNo={course.code} sectionNo={course.section} isAr={isAr} />
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredData.map((course, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={`${course.code}-${idx}`}
                    className="p-4 rounded-2xl bg-surface/40 backdrop-blur-xl border border-white/10 shadow-lg space-y-3 font-['Cairo']"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1 min-w-0 text-right w-full">
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                          {course.code}
                        </span>
                        <h3 className="text-sm font-black text-foreground leading-snug break-words">
                          {course.name}
                        </h3>
                        <span className="text-[9px] text-muted-foreground font-bold flex items-center gap-1 justify-start rtl:justify-end mt-0.5">
                          {DEPARTMENTS.find(d => d.id === course.dept)?.emoji} {isAr ? DEPARTMENTS.find(d => d.id === course.dept)?.nameAr : DEPARTMENTS.find(d => d.id === course.dept)?.nameEn}
                        </span>
                      </div>
                      {course.status === 'متاحة' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black border border-green-500/20 shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {course.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[9px] font-black border border-red-500/20 shrink-0">
                          <XCircle className="w-2.5 h-2.5" />
                          {course.status}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs font-bold text-muted-foreground pt-3 border-t border-white/5 text-right" dir={isAr ? "rtl" : "ltr"}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="truncate">{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                          <Clock className="w-3 h-3" />
                        </div>
                        <span className="truncate" dir="ltr">{course.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                          <MapPin className="w-3 h-3" />
                        </div>
                        <span className="truncate">{course.room}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-start rtl:justify-end">
                        <span className="font-black text-foreground/80 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                          {isAr ? `شعبة: ${course.section}` : `Sec: ${course.section}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-white/5 pt-3">
                      <SectionAlertButton courseNo={course.code} sectionNo={course.section} isAr={isAr} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="p-20 text-center bg-surface/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl text-muted-foreground">
            {isAr ? "لا توجد نتائج مطابقة" : "No results found"}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionAlertButton({ courseNo, sectionNo, isAr }: { courseNo: string; sectionNo: string; isAr: boolean }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [entitlement, setEntitlement] = useState<{ enabled: boolean; max_courses: number; max_sections: number; expires_at: string | null } | null>(null);
  const [usedSections, setUsedSections] = useState(0);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      if (!user) { setFollowing(false); setUsedSections(0); return; }
      const [followResult, usageResult, entitlementResult] = await Promise.all([
        supabase.from("course_alerts").select("id").eq("user_id", user.id).eq("course_no", courseNo).eq("section_no", sectionNo).eq("is_active", true).limit(1).maybeSingle(),
        supabase.from("course_alerts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_active", true),
        supabase.from("course_alert_entitlements").select("enabled,max_courses,max_sections,expires_at").eq("user_id", user.id).maybeSingle()
      ]);
      if (!mounted) return;
      setFollowing(Boolean(followResult.data));
      setUsedSections(usageResult.count || 0);
      setEntitlement((entitlementResult.data as any) || null);
    };
    refresh();
    const onAlertsUpdated = () => { refresh(); };
    window.addEventListener("course-alerts-updated", onAlertsUpdated);
    return () => { mounted = false; window.removeEventListener("course-alerts-updated", onAlertsUpdated); };
  }, [user?.id, courseNo, sectionNo]);

  const toggle = async () => {
    if (!user) {
      toast.info(isAr ? "سجّل الدخول لتفعيل تنبيه المادة أو الشعبة" : "Sign in to follow this course or section");
      return;
    }
    if (!following && (!entitlement?.enabled || (entitlement.expires_at && new Date(entitlement.expires_at) <= new Date()))) {
      toast.info(isAr ? "هذه الخاصية متاحة للحسابات المشتركة فقط" : "This feature is available to subscribed accounts only");
      return;
    }
    setSaving(true);
    if (following) {
      const { error } = await supabase.from("course_alerts").delete().eq("user_id", user.id).eq("course_no", courseNo).eq("section_no", sectionNo);
      if (!error) { setFollowing(false); setUsedSections(value => Math.max(0, value - 1)); window.dispatchEvent(new Event("course-alerts-updated")); }
    } else {
      const { error } = await supabase.from("course_alerts").insert({ user_id: user.id, course_no: courseNo, section_no: sectionNo, is_active: true });
      if (!error) { setFollowing(true); setUsedSections(value => value + 1); window.dispatchEvent(new Event("course-alerts-updated")); }
      else if (error.message.includes("COURSE_ALERT_COURSE_LIMIT")) toast.error(isAr ? "وصلت إلى الحد الأقصى لعدد المواد" : "You reached the course limit");
      else if (error.message.includes("COURSE_ALERT_SECTION_LIMIT")) toast.error(isAr ? "وصلت إلى الحد الأقصى لعدد الشعب" : "You reached the section limit");
      else if (error.message.includes("COURSE_ALERTS_NOT_ENTITLED")) toast.error(isAr ? "لا يوجد اشتراك مفعّل لهذا الحساب" : "No active alert subscription for this account");
    }
    setSaving(false);
  };

  return <button type="button" onClick={toggle} disabled={saving} className={cn("inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black transition-all disabled:opacity-50", following ? "border-secondary/40 bg-secondary/15 text-secondary" : "border-white/10 bg-white/5 text-muted-foreground hover:border-secondary/30 hover:text-secondary")} title={!entitlement?.enabled ? (isAr ? "خاصية مدفوعة" : "Paid feature") : (isAr ? `متابعة الشعبة (${usedSections}/${entitlement.max_sections})` : `Follow section (${usedSections}/${entitlement.max_sections})`)}>
    {following ? <BellRing className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
    {following ? (isAr ? "التنبيه مفعّل" : "Alert on") : !entitlement?.enabled ? (isAr ? "اشتراك مطلوب" : "Subscription required") : (isAr ? `فعّل التنبيه (${Math.max(0, entitlement.max_sections - usedSections)} متبقي)` : `Follow (${Math.max(0, entitlement.max_sections - usedSections)} left)`)}
  </button>;
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
