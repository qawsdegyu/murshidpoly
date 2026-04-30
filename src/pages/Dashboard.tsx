import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { m, type Variants } from "framer-motion";
import { Calculator, Users, BookOpen, GraduationCap, ShoppingBag, ArrowRight, MapPin, ExternalLink, FileText, BookOpenText, BrainCircuit } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import AnnouncementCard from "@/components/AnnouncementCard";
import QuickLinkCard from "@/components/QuickLinkCard";
import BauQuickLinks from "@/components/BauQuickLinks";
import { buildings } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";
import AdSpace from "@/components/AdSpace";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
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

  useEffect(() => {
    async function getProfileAndAnnouncements() {
      if (!user) {
        setIsProfileLoading(false);
        return;
      }

      try {
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, major, is_admin")
          .eq("id", user.id)
          .maybeSingle();

        let currentMajor = null;
        let isAdmin = false;

        if (profileData) {
          const first = profileData.full_name?.split(" ")[0] || null;
          currentMajor = profileData.major;
          isAdmin = !!profileData.is_admin;
          setProfile({ name: first, major: currentMajor, isAdmin });
        }

        // 2. Fetch Announcements from Supabase
        const { data: announcementsData, error: annError } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false });

        if (announcementsData && announcementsData.length > 0) {
          // Filtering Logic:
          // Admin sees all.
          // Student sees: is_global = true OR target_major == user_major
          const filtered = announcementsData.filter(ann => {
            if (isAdmin) return true;
            if (ann.is_global) return true;
            return ann.target_major === currentMajor;
          });

          if (filtered.length > 0) {
            setAnnouncementsList(filtered);
          } else {
            // Fallback to local mock data if Supabase is empty or filtering fails
            const { announcements: localAnnouncements } = await import("@/data/announcements");
            const localFiltered = localAnnouncements.filter(ann => {
              if (isAdmin) return true;
              if (ann.is_global) return true;
              return ann.target_major === currentMajor;
            });
            setAnnouncementsList(localFiltered);
          }
        } else {
          // Fallback to local mock data
          const { announcements: localAnnouncements } = await import("@/data/announcements");
          const localFiltered = localAnnouncements.filter(ann => {
            if (isAdmin) return true;
            if (ann.is_global) return true;
            return ann.target_major === currentMajor;
          });
          setAnnouncementsList(localFiltered);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsProfileLoading(false);
      }
    }

    getProfileAndAnnouncements();
  }, [user]);

  const stats = [
    { label: lang === "ar" ? "ملفات الدراسة" : "Study Files", value: "240+", icon: FileText, to: "/vault", prefetch: PAGE_IMPORTS.Vault },
    { label: lang === "ar" ? "التخصصات" : "Majors", value: "10", icon: GraduationCap, to: "/majors", prefetch: PAGE_IMPORTS.Majors },
    { label: lang === "ar" ? "حاسبة المعدل" : "GPA Calc", value: lang === "ar" ? "ذكية" : "Smart", icon: Calculator, to: "/gpa", prefetch: PAGE_IMPORTS.GPACalculator },
    { label: lang === "ar" ? "خريطة الحرم" : "Campus Map", value: lang === "ar" ? "تفاعلية" : "Interactive", icon: MapPin, to: "/campus-map", prefetch: PAGE_IMPORTS.BuildingsPage },
  ];

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
      to: "/roadmap",
      icon: BrainCircuit,
      label: lang === "ar" ? "الخطة الدراسية" : "Study Plan",
      desc: lang === "ar" ? "تتبع مسارك الأكاديمي" : "Track your academic journey",
      prefetch: PAGE_IMPORTS.MajorPage
    },
  ];

  return (
    <m.div className="flex flex-col" variants={container} initial="hidden" animate="show">
      {/* Interactive Hero Announcement Card */}
      <m.section
        variants={item}
        className="relative overflow-hidden w-full min-h-[55vh] md:min-h-[70vh] flex items-center transition-all duration-500"
      >
        <Link
          to="/announcement/official-launch-v1"
          className="absolute inset-0 z-0 group/hero overflow-hidden"
        >
          {/* Background Image with Overlays */}
          <img
            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=2000"
            alt="Engineering Tech"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover/hero:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />

          {/* Interactive Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        </Link>

        <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-32 pb-16 w-full pointer-events-none">
          <div className="max-w-5xl">
            {(() => {
              const launchAnn = announcementsList.find(a => a.id === "official-launch-v1") || announcementsList[0];
              return (
                <>
                  <Link to="/announcement/official-launch-v1" className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-xs font-black tracking-widest uppercase mb-6 shadow-lg hover:bg-accent/30 transition-colors group/badge">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    {lang === "ar" ? (launchAnn?.titleAr || "الإطلاق الرسمي") : (launchAnn?.title || "Official Launch")}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                  </Link>

                  <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-6 leading-[1.1] drop-shadow-2xl font-['Cairo'] tracking-tight">
                    {isProfileLoading ? (
                      <Skeleton className="h-16 md:h-24 lg:h-32 w-[300px] md:w-[500px] bg-white/10 rounded-2xl" />
                    ) : (
                      <>
                        {user ? (
                          <>
                            <span className="block opacity-90 text-2xl md:text-3xl lg:text-4xl mb-2">مرحباً بك يا انجنير</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#00ffff] to-yellow-400 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                              {profile.name || "المستقبل"}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="block opacity-90 text-2xl md:text-3xl lg:text-4xl mb-2">مرحباً بك يا</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#00ffff] to-yellow-400">
                              مهندس المستقبل
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </h1>

                  <p className="text-neutral-300 text-sm md:text-xl lg:text-2xl max-w-2xl leading-relaxed font-bold drop-shadow-lg opacity-90">
                    {lang === "ar"
                      ? (launchAnn?.shortDescriptionAr || "تم إنشاؤه بواسطة فريق من طلاب الهندسة في السنة الثانية")
                      : (launchAnn?.shortDescription || "Created by a team of 2nd-year Engineering Students")}
                  </p>
                </>
              );
            })()}

            <Link to="/announcement/official-launch-v1" className="pointer-events-auto mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-black transition-all group/cta">
              {lang === "ar" ? "اعرف أكثر عن الفريق" : "Learn More About the Team"}
              <ArrowRight className={`w-5 h-5 transition-transform group-hover/cta:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover/cta:-translate-x-1' : ''}`} />
            </Link>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none hidden md:block" />
      </m.section>

      {/* Advertisement Space */}
      <AdSpace isAdmin={profile.isAdmin} />

      {/* Announcements Section - Directly below Hero with Zero Gap */}
      {announcementsList.length > 0 && (
        <m.section
          variants={item}
          className="relative w-full bg-slate-950 pt-0 pb-12 md:pb-20 px-4 md:px-6 lg:px-8 overflow-hidden border-t border-cyan-500/20"
        >
          {/* Section Background Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
              alt="Network Background"
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-slate-950" />
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 max-w-[1440px] mx-auto">
            <div className="flex items-center gap-4 mb-8 pt-10">
              <h2 className="text-2xl md:text-4xl font-black text-white font-['Cairo'] tracking-tight">
                {lang === "ar" ? "الإعلانات والمستجدات" : "Announcements & Updates"}
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent rounded-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {announcementsList.map((ann, idx) => (
                <AnnouncementCard key={ann.id || idx} data={ann} />
              ))}
            </div>
          </div>
        </m.section>
      )}

      {/* Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 space-y-16 md:space-y-24 w-full">
        {/* Public Resource Stats */}
        <m.section variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats?.map((s) => (
            <m.div
              key={s.label}
              variants={item}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={s.to}
                onMouseEnter={() => prefetchPage(s.prefetch)}
                className="group bg-surface/80 border border-border shadow-sm backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col h-full transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-accent/10 border border-accent/20 grid place-items-center group-hover:bg-accent/20 transition-colors">
                    <s.icon className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-2xl md:text-4xl font-black text-content tracking-tighter mb-1">{s.value}</div>
                <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-content/50">{s.label}</div>
              </Link>
            </m.div>
          ))}
        </m.section>


        <m.section variants={item} className="relative z-10">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-foreground">{t.dashboard.quickActions}</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/50 via-accent/5 to-transparent rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:flex lg:justify-center lg:gap-10">
            {quickActions?.map((a) => (
              <QuickLinkCard
                key={a.to}
                to={a.to}
                icon={a.icon}
                label={a.label}
                prefetch={a.prefetch}
              />
            ))}
          </div>
        </m.section>

        {/* Campus Guide */}
        <m.section variants={item}>
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground">{t.dashboard.campusGuide || "Campus Guide"}</h2>
            <div className="h-px flex-1 mx-6 md:mx-10 bg-gradient-to-r from-accent/40 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {buildings?.map((b) => (
              <m.a
                key={b.id}
                href={b.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-card/80 border border-border shadow-sm backdrop-blur-xl overflow-hidden rounded-[2rem] md:rounded-[2.5rem] flex flex-col transition-all duration-300"
              >
                <div className="h-32 md:h-40 w-full relative overflow-hidden">
                  <img
                    src={b.imageUrl}
                    alt={b.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 ltr:right-3 rtl:left-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md grid place-items-center text-white border border-white/20 shadow-lg">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
                <div className="p-4 md:p-6 flex-1 flex flex-col bg-card/50 dark:bg-card/20 backdrop-blur-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-accent/20 border border-accent/30 grid place-items-center text-accent shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <h3 className="font-black text-lg md:text-xl leading-tight text-foreground break-words">
                      {lang === "ar" ? b.nameAr : b.name}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-1 mb-4 font-bold">
                    {lang === "ar" ? b.descriptionAr : b.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {(lang === "ar" ? b?.departmentsAr : b?.departments)?.map((dept) => (
                      <span key={dept} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl bg-accent/10 text-accent border border-accent/20">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </m.a>
            ))}
          </div>
        </m.section>



        {/* BAU Official Quick Links */}
        <m.div variants={item}>
          <BauQuickLinks />
        </m.div>
      </div>
    </m.div>
  );
}
