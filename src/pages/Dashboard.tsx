import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { m, type Variants } from "framer-motion";
import { Calculator, Users, BookOpen, GraduationCap, ShoppingBag, ArrowRight, MapPin, ExternalLink, FileText, BookOpenText, BrainCircuit, Bot, Plus, Gavel, Newspaper, Calendar, Scale, Clock, Lightbulb, Network, ArrowLeft, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { isAnnouncementVisibleForMajor, normalizeMajorId } from "@/lib/majors";
import { Skeleton } from "@/components/ui/skeleton";
import AnnouncementCard from "@/components/AnnouncementCard";
import QuickLinkCard from "@/components/QuickLinkCard";
import BauQuickLinks from "@/components/BauQuickLinks";
import { type Building } from "@/data/buildings";
import { cn, getOptimizedStorageUrl } from "@/lib/utils";
import AdSpace from "@/components/AdSpace";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";
import { isUserAdmin } from "@/lib/admin";
import ShareButton from "@/components/ShareButton";
import FeatureGate from "@/components/FeatureGate";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { getTipOfTheDay } from "@/data/tips";


const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function Dashboard() {
  const { t, lang } = usePreferences();
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ name: string | null; major: string | null; isAdmin: boolean }>({ name: null, major: null, isAdmin: false });
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [announcementsList, setAnnouncementsList] = useState<any[]>([]);
  const [activeAnnouncementIndex, setActiveAnnouncementIndex] = useState(0);
  const [buildingsList, setBuildingsList] = useState<Building[]>([]);
  const [instructorsTotal, setInstructorsTotal] = useState<number | string>("150+");
  const [buildingsTotal, setBuildingsTotal] = useState<number | string>("12+");
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [isWeekend, setIsWeekend] = useState(false);
  const [disabledPages, setDisabledPages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMaintenance() {
      try {
        const { data, error } = await supabase.from('maintenance_mode').select('page_id').eq('is_active', true);
        if (!error && data) {
          setDisabledPages(data.map(d => d.page_id));
        }
      } catch (err) {
        console.error("Error fetching maintenance status", err);
      }
    }
    fetchMaintenance();
  }, []);

  useEffect(() => {
    if (announcementsList.length <= 1) {
      setActiveAnnouncementIndex(0);
      return;
    }

    setActiveAnnouncementIndex((current) => Math.min(current, announcementsList.length - 1));
    const intervalId = window.setInterval(() => {
      setActiveAnnouncementIndex((current) => (current + 1) % announcementsList.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [announcementsList.length]);

  useEffect(() => {
    const todayIdx = new Date().getDay();
    setIsWeekend(todayIdx === 5 || todayIdx === 6); // 5: Fri, 6: Sat in Jordan

    const localData = localStorage.getItem('my_schedule_data');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((item: any) =>
            Array.isArray(item.days) && item.days.includes(todayIdx)
          );
          // Sort classes by start time
          filtered.sort((a: any, b: any) => (a.startTime || "").localeCompare(b.startTime || ""));
          setTodayClasses(filtered);
        }
      } catch (e) {
        console.error("Error parsing schedule on dashboard", e);
      }
    }
  }, [user]);

  useEffect(() => {
    let active = true;

    async function getProfileAndAnnouncements() {
      try {
        if (!user) {
          const { data: publicAnnouncements, error: publicAnnouncementsError } = await supabase
            .from("announcements")
            .select(`
              id,
              title,
              title_ar,
              short_description,
              short_description_ar,
              full_description,
              full_description_ar,
              badge_ar,
              image_url,
              is_global,
              target_major,
              created_at
            `)
            .or("is_global.eq.true,target_major.in.(all,*)")
            .order("created_at", { ascending: false });

          if (!active) return;
          if (publicAnnouncementsError) {
            console.error("Public announcements fetch error:", publicAnnouncementsError);
          }
          setAnnouncementsList((publicAnnouncements || []).filter((announcement) => isAnnouncementVisibleForMajor(announcement, null, false)));
          setIsProfileLoading(false);
          return;
        }
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, student_id, phone, major, academic_year, is_admin")
          .eq("id", user.id)
          .maybeSingle();

        if (!active) return;

        let currentMajor = null;
        const isEmailAdmin = isUserAdmin(user.email);
        let isAdmin = !!isEmailAdmin;

        if (profileData) {
          const first = profileData.full_name?.split(" ")[0] || t.dashboard.future;
          currentMajor = normalizeMajorId(profileData.major);
          isAdmin = !!profileData.is_admin || !!isEmailAdmin;
          setProfile({ name: first, major: currentMajor, isAdmin });
        } else {
          const metadata = user?.user_metadata || {};
          const name = metadata.full_name || metadata.name || (isEmailAdmin ? "Admin" : t.dashboard.future);
          const first = name.split(" ")[0];
          currentMajor = metadata.major ? normalizeMajorId(metadata.major) : null;
          isAdmin = !!isEmailAdmin;
          setProfile({ name: first, major: currentMajor, isAdmin });
        }

        // 2. Fetch Announcements from Supabase
        const { data: announcementsData, error: annError } = await supabase
          .from("announcements")
          .select(`
            id,
            title,
            title_ar,
            short_description,
            short_description_ar,
            full_description,
            full_description_ar,
            badge_ar,
            image_url,
            is_global,
            target_major,
            created_at
          `)
          .order("created_at", { ascending: false });

        if (!active) return;

        if (announcementsData) {
          // Admin sees all. Students see global announcements or any announcement targeting their major.
          const filtered = announcementsData.filter(ann => isAnnouncementVisibleForMajor(ann, currentMajor, isAdmin));
          setAnnouncementsList(filtered);
        }

        // 3. Fetch Buildings (Featured)
        const { data: buildingsData } = await supabase
          .from("buildings")
          .select(`
            id,
            nameAr:name_ar,
            nameEn:name_en,
            descAr:desc_ar,
            descEn:desc_en,
            imageUrl:image_url,
            mapUrl:map_url,
            tag,
            tagEn:tag_en
          `)
          .eq("is_featured", true)
          .limit(3);

        if (!active) return;

        // 4. Fetch Counts for Stats
        const { count: iCount } = await supabase.from('instructors').select('*', { count: 'exact', head: true });
        if (iCount !== null) setInstructorsTotal(iCount);

        const { count: bCount } = await supabase.from('buildings').select('*', { count: 'exact', head: true });
        if (bCount !== null) setBuildingsTotal(bCount);

        if (buildingsData && buildingsData.length > 0) {
          setBuildingsList(buildingsData as any);
        } else {
          const { buildings: localBuildings } = await import("@/data/buildings");
          if (active) setBuildingsList(localBuildings.slice(0, 3));
        }
      } catch (err) {
        if (active) {
          console.error("Critical Dashboard Fetch Error:", err);
          // Last resort fallback
          const { announcements: localAnnouncements } = await import("@/data/announcements");
          setAnnouncementsList(localAnnouncements.slice(0, 3));
        }
      } finally {
        if (active) {
          setIsProfileLoading(false);
        }
      }
    }

    getProfileAndAnnouncements();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  if (isProfileLoading) {
    return <DashboardSkeleton />;
  }

  const stats = [
    { label: lang === "ar" ? "ملفات الدراسة" : "Study Files", value: "240+", icon: FileText, to: "/vault", prefetch: PAGE_IMPORTS.Vault },
    { label: lang === "ar" ? "التخصصات" : "Majors", value: "10", icon: GraduationCap, to: "/majors", prefetch: PAGE_IMPORTS.Majors },
    { label: lang === "ar" ? "المدرسين" : "Instructors", value: `${instructorsTotal}`, icon: Users, to: "/instructors", prefetch: PAGE_IMPORTS.Faculty },
    { label: lang === "ar" ? "مباني الجامعة" : "Campus Buildings", value: `${buildingsTotal}`, icon: MapPin, to: "/campus-map", prefetch: PAGE_IMPORTS.BuildingsPage },
  ];

  const activeAnnouncement = announcementsList[activeAnnouncementIndex] || announcementsList[0];

  const quickActions = [
    {
      to: "/instructors",
      icon: Users,
      label: lang === "ar" ? "دليل المدرسين" : "Instructors",
      desc: lang === "ar" ? "تواصل مع مدرسي الكلية" : "Contact faculty members",
      prefetch: PAGE_IMPORTS.Faculty
    },
    {
      to: "/vault",
      icon: BookOpenText,
      label: lang === "ar" ? "خزانة المواد" : "Subject Vault",
      desc: lang === "ar" ? "ملخصات، كتب، سنوات سابقة" : "Summaries, books, exams, quizzes",
      prefetch: PAGE_IMPORTS.Vault
    },
    {
      to: "/campus-map",
      icon: MapPin,
      label: lang === "ar" ? "مواقع المباني" : "Campus Map",
      desc: lang === "ar" ? "خريطة تفاعلية للمباني والقاعات" : "Interactive map of buildings",
      prefetch: PAGE_IMPORTS.BuildingsPage
    },
    {
      to: "/gpa",
      icon: Calculator,
      label: lang === "ar" ? "حاسبة المعدل" : "GPA Calculator",
      desc: lang === "ar" ? "احسب معدلك الفصلي والتراكمي بدقة" : "Calculate semester & cumulative GPA",
      prefetch: PAGE_IMPORTS.GPACalculator
    },
    {
      to: "/marketplace",
      icon: ShoppingBag,
      label: lang === "ar" ? "السوق" : "Marketplace",
      desc: lang === "ar" ? "بيع وشراء الأدوات الهندسية" : "Buy & sell engineering tools",
      prefetch: PAGE_IMPORTS.Marketplace
    },
    {
      to: "/newspaper",
      icon: Newspaper,
      label: lang === "ar" ? "جريدة المواد" : "Course Newspaper",
      desc: lang === "ar" ? "جميع الشعب المتاحة للفصل" : "All available sections for the semester",
      prefetch: PAGE_IMPORTS.CourseNewspaper
    },
  ];

  return (
    <m.div className="flex flex-col" variants={container} initial="hidden" animate="show">
      {/* New Hero Section Matching Image UI */}
      <m.section
        variants={item}
        className="relative w-full pt-0 pb-6 md:pb-10"
      >
        <div className="relative z-10 px-4 md:px-6 lg:px-8 w-full max-w-[1440px] mx-auto">
          {/* Big Rectangle Wrapper */}
          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] rounded-3xl md:rounded-[3rem] p-3 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-3 md:gap-6 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.5)]">

            {/* Right Side: Welcome & Actions Box (Visually Right in RTL) */}
            <div className="flex flex-col justify-center flex-1 space-y-3 md:space-y-8 lg:max-w-[50%] p-1 md:p-4 lg:p-6">

              <div className="space-y-0.5 md:space-y-3 pt-0 md:pt-4">
                <h2 className="text-xs md:text-2xl font-bold text-slate-500 font-['Cairo']">
                  {t.dashboard.welcome}
                </h2>
                <h1 className="text-xl md:text-5xl lg:text-6xl font-black text-[#2563EB] dark:text-[#F8FAFC] tracking-tighter uppercase font-mono leading-none md:leading-tight">
                  {user ? profile.name : t.dashboard.future}
                </h1>
                <p className="text-[#64748B] dark:text-[#94A3B8] text-[10px] md:text-base font-bold font-['Cairo'] max-w-lg mt-0.5 md:mt-2 leading-snug md:leading-normal">
                  {t.dashboard.hubDesc}
                </p>
              </div>

              {/* Tip of the Day Box (Desktop Only) */}
              <div className="hidden md:block bg-[#E8FCF9] border border-[#5EEAD4]/30 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden group hover:border-[#5EEAD4]/60 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5EEAD4]/20 border border-[#5EEAD4]/40">
                    <Lightbulb className="w-3.5 h-3.5 text-[#14B8A6]" />
                  </div>
                  <span className="text-[#14B8A6] text-xs md:text-sm font-bold font-['Cairo']">
                    {t.dashboard.tipOfTheDay}
                  </span>
                </div>
                <p className="text-[#0F172A] text-sm md:text-base font-bold leading-relaxed font-['Cairo'] relative z-10">
                  {getTipOfTheDay(lang)}
                </p>
              </div>

              {/* Ad Space (Mobile Only) */}
              <div className="block md:hidden w-full -mt-1 md:mt-0">
                <AdSpace placement="sidebar" className="w-full scale-95 origin-top md:scale-100" />
              </div>

              {/* Action Buttons (Desktop Only) */}
              <div className="hidden md:flex flex-row w-full gap-2 md:gap-4 md:w-auto md:flex-wrap">
                <Link to="/majors" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5EEAD4] dark:bg-[#14B8A6] hover:bg-[#5EEAD4]/80 dark:hover:bg-teal-500 transition-colors text-sm font-bold text-[#0F172A] dark:text-[#0B1220] group shadow-sm">
                  <Network className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {t.dashboard.treePlan}
                </Link>
                <Link to="/my-schedule" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E293B] hover:bg-slate-700 transition-colors text-sm font-bold text-[#F8FAFC] group shadow-sm">
                  <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {t.dashboard.schedule}
                </Link>
              </div>
            </div>

            {/* Left Side: Announcement Box (Visually Left in RTL) */}
            <div className="flex-1 w-full lg:max-w-[50%] space-y-4">
              <div className="block w-full h-full min-h-[300px] relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] group shadow-[0_4px_6px_-1px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.5)] transition-all hover:border-[#CBD5E1] dark:hover:border-[#14B8A6]">
                {activeAnnouncement ? (
                  <Link to={`/announcement/${activeAnnouncement.id}`} className="block w-full h-full min-h-[300px] relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-0">
                      {activeAnnouncement.image_url ? (
                        <img src={getOptimizedStorageUrl(activeAnnouncement.image_url, 800, 600)} alt="" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                          <Megaphone className="w-12 h-12 opacity-30" />
                          <span className="font-bold text-lg font-['Cairo']">لا يوجد إعلانات حالياً</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                      <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F172A] border border-[#E2E8F0] shadow-sm"><Megaphone className="w-3.5 h-3.5 text-[#14B8A6]" /> إعلانات</span>
                      <span className="bg-[#5EEAD4] text-[#0F172A] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">تحديث جديد</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-[#F8FAFC] dark:from-[#1E293B] via-[#F8FAFC]/90 dark:via-[#1E293B]/90 to-transparent z-10 flex flex-col items-center text-center">
                      <h3 className="text-xl md:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] mb-4 line-clamp-2 leading-tight">{lang === "ar" ? activeAnnouncement.title_ar : activeAnnouncement.title}</h3>
                      <div className="flex items-center justify-end w-full gap-2 text-[#14B8A6] text-xs font-bold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">اعرف المزيد <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" /></div>
                    </div>
                  </Link>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3"><Megaphone className="w-12 h-12 opacity-30" /><span className="font-bold text-lg font-['Cairo']">لا يوجد إعلانات حالياً</span></div>
                )}

                {announcementsList.length > 1 && (
                  <>
                    <button type="button" aria-label="الإعلان السابق" onClick={() => setActiveAnnouncementIndex((current) => (current - 1 + announcementsList.length) % announcementsList.length)} className="absolute z-20 left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/85 dark:bg-slate-900/80 text-slate-700 dark:text-white border border-white/60 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors" onMouseDown={(event) => event.preventDefault()}><ChevronLeft className="w-5 h-5" /></button>
                    <button type="button" aria-label="الإعلان التالي" onClick={() => setActiveAnnouncementIndex((current) => (current + 1) % announcementsList.length)} className="absolute z-20 right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/85 dark:bg-slate-900/80 text-slate-700 dark:text-white border border-white/60 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors" onMouseDown={(event) => event.preventDefault()}><ChevronRight className="w-5 h-5" /></button>
                    <div className="absolute z-20 bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2" aria-label="مؤشر الإعلانات">
                      {announcementsList.map((announcement, index) => <button key={announcement.id} type="button" aria-label={`عرض الإعلان ${index + 1}`} onClick={() => setActiveAnnouncementIndex(index)} className={cn("p-0 shrink-0 !min-h-0 rounded-full transition-all duration-300", index === activeAnnouncementIndex ? "w-6 md:w-8 h-1.5 md:h-2 bg-[#14B8A6]" : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/50 hover:bg-white/80")} />)}
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons (Mobile Only - Under Announcements) */}
              <div className="flex md:hidden flex-row w-full gap-2 mt-4">
                <Link to="/majors" className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 active:bg-emerald-500/10 transition-colors text-[10px] font-bold text-emerald-400 text-center shadow-sm">
                  <Network className="w-3.5 h-3.5 shrink-0" />
                  <span>الخطة الشجرية</span>
                </Link>
                <Link to="/my-schedule" className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl bg-blue-500/5 border border-blue-500/20 active:bg-blue-500/10 transition-colors text-[10px] font-bold text-blue-400 text-center shadow-sm">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>الجدول الدراسي</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </m.section>

      {/* Removed the announcements list section as requested */}

      {/* Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16 space-y-10 md:space-y-24 w-full">
        {/* Public Resource Stats */}
        <m.section variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <m.div
              key={s.label}
              variants={item}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                to={s.to}
                onMouseEnter={() => prefetchPage(s.prefetch)}
                className="group bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col h-full transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(20,184,166,0.15)] dark:hover:border-[#14B8A6]"
              >
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-[#E8FCF9] dark:bg-[#0F172A] border border-[#5EEAD4]/30 dark:border-[#334155] grid place-items-center group-hover:bg-[#5EEAD4]/20 dark:group-hover:border-[#14B8A6] transition-colors">
                    <s.icon className="h-4 w-4 md:h-5 md:w-5 text-[#5EEAD4] dark:text-[#14B8A6]" />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#14B8A6] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xl md:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tighter mb-0.5 md:mb-1">{s.value}</div>
                <div className="text-[11px] md:text-xs font-bold uppercase tracking-wide text-[#64748B] dark:text-[#94A3B8] leading-tight">{s.label}</div>
              </Link>
            </m.div>
          ))}
        </m.section>

        {!disabledPages.includes("assistant") && (
          <FeatureGate feature="ai_assistant">
            <m.section variants={item}>
              <Link to="/assistant" className="group relative block overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/80 p-5 text-white shadow-xl transition-all hover:-translate-y-1 hover:border-cyan-300/50 md:p-7">
                <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-cyan-400/15 blur-3xl" />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cyan-300/15 ring-1 ring-cyan-300/30"><Bot className="h-7 w-7 text-cyan-200" /></div>
                    <div><p className="text-xs font-black uppercase tracking-widest text-cyan-200">{lang === "ar" ? "خدمة طلابية جديدة" : "New student service"}</p><h2 className="mt-1 text-xl font-black md:text-2xl">{lang === "ar" ? "مساعد مُرشد الذكي" : "Murshid AI Assistant"}</h2><p className="mt-1 text-xs font-bold text-slate-300 md:text-sm">{lang === "ar" ? "اسأل عن المواد والخطط والأنظمة من المصادر المعتمدة" : "Ask about courses, plans, and policies from approved sources"}</p></div>
                  </div><ArrowRight className="h-6 w-6 text-cyan-200 transition-transform group-hover:-translate-x-1" />
                </div>
              </Link>
            </m.section>
          </FeatureGate>
        )}


        {/* Removed Quick Actions Section */}

        {/* Removed Campus Guide Section */}        {/* BAU Official Quick Links */}
        <m.div variants={item}>
          <BauQuickLinks />
        </m.div>
      </div>
    </m.div>
  );
}

