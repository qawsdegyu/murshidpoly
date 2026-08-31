import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Search, Code2, Shield,
  Banknote, Languages, LayoutGrid,
  Wrench, Flag, Lightbulb, Type, GraduationCap, FileText,
  Share2, Upload, FlaskConical, Calculator, Plus, Settings, Brain, Globe
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { courses, resourcesByCourse } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import AdSpace from "@/components/AdSpace";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import VaultSkeleton from "@/components/skeletons/VaultSkeleton";
import { cn } from "@/lib/utils";
import { normalizeMajorId, normalizeCourseMajors, isCourseVisibleForMajor } from "@/lib/majors";

export default function Vault() {
  const { t, lang, dir } = usePreferences();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState("");
  const activeTab = searchParams.get("category") || "all";

  const setActiveTab = (id: string) => {
    if (id === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", id);
    }
    setSearchParams(searchParams);
  };

  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [guestLimited, setGuestLimited] = useState(false);
  const [guestRequested, setGuestRequested] = useState(false);
  const [guestMode, setGuestMode] = useState<"first-two" | "all">("first-two");

  // Fetch courses from Supabase
  useEffect(() => {
    let active = true;

    async function fetchCourses() {
      if (loading) return;

      if (!user && !guestRequested) {
        if (active) {
          setCoursesList([]);
          setGuestLimited(true);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        console.log('Attempting to fetch courses from Supabase...');
        
        let userMajor: string | null = null;
        let guestCourseIds: Set<string> | null = null;
        if (user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('major')
              .eq('id', user.id)
              .maybeSingle();

            if (profileError) {
              console.error("Error fetching user profile for Vault", profileError);
            }

            userMajor = normalizeMajorId(
              profile?.major || user.user_metadata?.major || user.user_metadata?.specialization
            );
          } catch (e) {
            console.error("Error fetching user profile for Vault", e);
          }

          // Never fall back to the full catalog for an authenticated student:
          // an unknown major would leak courses from other departments.
          if (!userMajor) {
            if (active) {
              setCoursesList([]);
              toast.error(lang === 'ar' ? 'يرجى تحديد تخصصك أولًا لعرض المواد المناسبة' : 'Select your major first to view relevant courses');
            }
            return;
          }
        } else if (guestMode === "first-two") {
          // Guests may browse only the first two academic years. The allow-list
          // comes from the database curriculum, not from client-side labels.
          const { data: publicPlanEntries, error: publicPlanError } = await supabase
            .from('curriculum_plan_entries')
            .select('course_id')
            .lte('academic_year', 2)
            .not('course_id', 'is', null);

          if (publicPlanError) {
            console.error("Error fetching public first-two-year curriculum", publicPlanError);
            throw publicPlanError;
          }

          guestCourseIds = new Set(
            (publicPlanEntries || [])
              .map((entry: any) => String(entry.course_id || '').trim())
              .filter(Boolean),
          );
        }

        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('name_ar', { ascending: true });

        if (!active) return;

        let fetchedCourses: any[] = [];
        let useFallback = false;

        if (error) {
          console.error('Supabase Error:', error);
          useFallback = true;
        } else if (!data || data.length === 0) {
          console.warn('Database returned zero courses. Falling back to local data.');
          useFallback = true;
        } else {
          fetchedCourses = data;
        }

        // Fallback to local mockData if Supabase fails or is empty
        if (useFallback) {
           fetchedCourses = courses.map(c => ({
              id: c.id,
              code: c.code,
              name_en: c.name,
              name_ar: c.nameAr,
              credit_hours: c.hours,
              department: c.department,
              category: c.category,
              majors: (c as any).majors || ["common"]
           }));
        }
          
        let allCourses = fetchedCourses || [];
        // Authenticated students receive only their explicit curriculum plus
        // approved shared foundation categories. Guests receive only the database
        // allow-list for academic years one and two.
        if (userMajor) {
          allCourses = allCourses.filter(c => isCourseVisibleForMajor(c, userMajor));
        } else if (guestCourseIds) {
          allCourses = allCourses.filter(c => guestCourseIds!.has(String(c.id)));
        }

        setGuestLimited(!user);

        const mapped = allCourses.map(c => {
          return {
            id: c.id,
            code: c.code,
            name: c.name_en || c.name_ar || "",
            nameAr: c.name_ar || "",
            hours: c.credit_hours || 0,
            department: c.department || "",
            category: c.category || "other",
            majors: normalizeCourseMajors(c.majors),
            instructors: [] // Rely only on DB, empty for now as DB has no instructors column
          };
        });
        setCoursesList(mapped);
      } catch (err: any) {
        if (active) {
          console.error('Unexpected Fetch Error:', err);
          toast.error(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'Unexpected error fetching data');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    fetchCourses();

    return () => {
      active = false;
    };
  }, [lang, user, loading, guestRequested, guestMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const groupedData = useMemo(() => {
    if (isLoading) return [];

    // Robust normalization for Arabic and English search
    const normalize = (text: string) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[\u064B-\u065F]/g, "") // Remove Arabic diacritics (tashkeel)
        .trim();
    };

    const normalizedQ = normalize(q);
    const searchWords = normalizedQ.split(/\s+/).filter(word => word.length > 0);

    const baseFiltered = coursesList.filter(c => {
      if (searchWords.length === 0) return true;

      const targetName = normalize(c.name);
      const targetNameAr = normalize(c.nameAr);
      const targetCode = normalize(c.code);
      const combinedTarget = `${targetName} ${targetNameAr} ${targetCode}`;

      // Every search word must be found somewhere in the combined target string
      return searchWords.every(word => combinedTarget.includes(word));
    });
    // If activeTab is "all", show everything. 
    // If we are in a specific tab but it's empty, we'll handle that in groupedData
    const matchesCategory = (c: any) => activeTab === "all" || c.category === activeTab;
    const finalFiltered = baseFiltered.filter(matchesCategory);

    if (activeTab !== "all") {
      return [{ categoryId: activeTab, courses: finalFiltered }];
    }

    const groups: Record<string, any[]> = {};

    baseFiltered.forEach(c => {
      let catId = c.category || "other";
      if (!groups[catId]) groups[catId] = [];
      groups[catId].push(c);
    });

    const displayCategories: { id: string; nameEn: string; nameAr: string; icon: any }[] = [
      { id: "all", nameEn: "All", nameAr: "الكل", icon: LayoutGrid }
    ];

    Object.keys(groups).forEach(catId => {
      displayCategories.push({
        id: catId,
        nameEn: catId,
        nameAr: catId,
        icon: BookOpen
      });
    });

    return displayCategories
      .filter(cat => cat.id !== "all" && groups[cat.id] && groups[cat.id].length > 0)
      .map(cat => ({
        categoryId: cat.id,
        categoryName: cat.nameAr,
        courses: groups[cat.id]
      }));
  }, [q, activeTab, lang, coursesList, isLoading]);

  const dynamicCategories = useMemo(() => {
    const uniqueCats = Array.from(new Set(coursesList.map(c => c.category || "other")));
    const cats = [{ id: "all", nameEn: "All", nameAr: "الكل", icon: LayoutGrid, count: coursesList.length }];
    uniqueCats.forEach(catId => {
      const count = coursesList.filter(c => (c.category || "other") === catId).length;
      cats.push({ id: catId, nameEn: catId, nameAr: catId, icon: BookOpen, count });
    });
    return cats;
  }, [coursesList]);


  if (loading || isLoading) {
    return (
      <div className="relative min-h-screen overflow-y-auto scrollbar-hide pointer-events-auto pb-16 md:pb-20 gpu-accelerated bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-[#F8FAFC] dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A]" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-0 pointer-events-auto transition-all duration-700">
          <PageHeader
            title={t.vault.title}
            subtitle={t.vault.subtitle}
            icon={<BookOpen className="h-7 w-7 md:h-14 md:w-14 text-accent" />}
            className="mb-6 md:mb-10"
          />
          <VaultSkeleton />
        </div>
      </div>
    );
  }

  if (!user && !guestRequested) {
    return (
      <div className="relative min-h-screen overflow-y-auto scrollbar-hide pointer-events-auto pb-16 md:pb-20 gpu-accelerated bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-[#F8FAFC] dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A]" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-0">
          <PageHeader
            title={t.vault.title}
            subtitle={t.vault.subtitle}
            icon={<BookOpen className="h-7 w-7 md:h-14 md:w-14 text-accent" />}
            className="mb-6 md:mb-10"
          />
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-accent/30 bg-card/80 p-6 text-center shadow-xl backdrop-blur-xl md:p-10" dir={dir}>
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-accent">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-foreground md:text-3xl">
              {lang === "ar" ? "اختر نطاق المواد قبل العرض" : "Choose a material range before viewing"}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-7 text-muted-foreground md:text-base">
              {lang === "ar"
                ? "يمكنك تصفح مواد السنتين الأولى والثانية أو فتح كامل مواد التخصصات. لن يتم جلب البيانات حتى تختار الزر المناسب."
                : "Browse the first two academic years or open the full specialization catalog. No material data is fetched until you choose an option."}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setGuestMode("first-two");
                  setGuestRequested(true);
                }}
                className="rounded-2xl border border-accent/40 bg-accent/10 px-5 py-5 text-right transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent/20 active:scale-[0.98]"
              >
                <span className="block text-lg font-black text-foreground">{lang === "ar" ? "مواد السنتين الأولى والثانية" : "First two academic years"}</span>
                <span className="mt-1 block text-sm font-bold text-muted-foreground">{lang === "ar" ? "عرض مختصر وسريع من الخطة الدراسية" : "A focused view from the curriculum"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuestMode("all");
                  setGuestRequested(true);
                }}
                className="rounded-2xl border border-blue-400/40 bg-blue-500/10 px-5 py-5 text-right transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-500/20 active:scale-[0.98]"
              >
                <span className="block text-lg font-black text-foreground">{lang === "ar" ? "كامل مواد التخصصات" : "All specialization materials"}</span>
                <span className="mt-1 block text-sm font-bold text-muted-foreground">{lang === "ar" ? "عرض الكتالوج الكامل للمواد" : "Open the complete material catalog"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-y-auto scrollbar-hide pointer-events-auto pb-16 md:pb-20 gpu-accelerated bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-[#F8FAFC] dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A]" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-0 pointer-events-auto transition-all duration-700">
        <PageHeader
          title={t.vault.title}
          subtitle={t.vault.subtitle}
          icon={<BookOpen className="h-7 w-7 md:h-14 md:w-14 text-accent" />}
          className="mb-6 md:mb-10"
        />

        {guestLimited && guestRequested && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4 text-right md:flex-row md:items-center md:justify-between" dir={dir}>
            <p className="text-sm font-bold text-foreground">
              {guestMode === "all"
                ? <>أنت تتصفح <span className="text-accent">كامل مواد التخصصات</span>. سجّل الدخول لحفظ المواد والوصول إلى المزايا الخاصة بتخصصك.</>
                : <>أنت تتصفح مواد <span className="text-accent">السنتين الأولى والثانية</span> فقط.</>}
            </p>
            <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setGuestRequested(false);
                  setCoursesList([]);
                }}
                className="rounded-xl border border-border bg-background/60 px-4 py-2 text-sm font-black text-foreground transition-colors hover:bg-muted"
              >
                تغيير النطاق
              </button>
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02] active:scale-95"
              >
                تسجيل الدخول
              </button>
            </div>
          </div>
        )}

        {/* Vault Banner Ad */}
        <AdSpace placement="vault_banner" className="mb-8" />


        <div className="space-y-12">
          <div
            onClick={() => navigate("/schedule")}
            className="mb-4 md:mb-5 p-4 md:p-5 rounded-2xl md:rounded-3xl bg-[#E8FCF9] dark:bg-[#1E293B] border border-[#5EEAD4] dark:border-[#334155] relative overflow-hidden group pointer-events-auto shadow-sm cursor-pointer hover:bg-[#E8FCF9]/80 dark:hover:bg-[#1E293B]/80 transition-all hidden md:block"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#5EEAD4]/10 blur-[80px] -ml-32 -mt-32 rounded-full hidden md:block" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#5EEAD4]/20 border border-[#5EEAD4]/30 flex items-center justify-center text-[#14B8A6] shrink-0 hidden md:flex">
                  <Calculator className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="text-center md:text-start">
                  <h3 className="text-lg md:text-2xl font-black text-[#14B8A6] dark:text-[#F8FAFC] mb-1.5">
                    {lang === "ar" ? "الجداول المقترحة (مخطط الجدولة الذكي)" : "Suggested Schedules Planner"}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-[#64748B] dark:text-[#94A3B8] font-bold max-w-xl leading-relaxed">
                    {lang === "ar"
                      ? "صمم جدولك الدراسي أو استعرض الجداول المقترحة الذكية بناءً على خطتك."
                      : "Design your schedule or view smart AI suggested schedules based on your plan."}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 w-full md:w-auto px-5 py-3 md:px-6 md:py-3 rounded-2xl bg-[#5EEAD4] dark:bg-[#14B8A6] text-[#0F172A] dark:text-[#0B1220] font-black hover:bg-[#5EEAD4]/90 dark:hover:bg-[#0d9488] transition-all shadow-sm text-sm md:text-base">
                <Calculator className="w-5 h-5" />
                {lang === "ar" ? "فتح المخطط" : "Open Planner"}
              </div>
            </div>
          </div>

          {/* ── Contribute Card ── */}
          <div
            className="mb-5 p-4 md:p-5 rounded-2xl md:rounded-3xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] relative overflow-hidden group pointer-events-auto shadow-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32 rounded-full hidden md:block" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] shrink-0 hidden md:flex"
                >
                  <Upload className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="text-center md:text-start">
                  <h3 className="text-lg md:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                    {lang === "ar" ? "شاركنا ملفاتك أو تلاخيصك" : "Share your files or summaries"}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-[#64748B] dark:text-[#94A3B8] font-bold max-w-xl leading-relaxed">
                    {lang === "ar"
                      ? "ساعد زملائك من خلال مشاركة مصادرك الدراسية في خزانة مرشد."
                      : "Help your colleagues by sharing your study resources in Murshid's Vault."}
                  </p>
                </div>
              </div>

              <motion.a
                href="https://api.whatsapp.com/send?phone=962785159906&text=مرحباً%20مرشد،%20أريد%20مشاركة%20ملفات%20لمادة:%20"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-5 py-3 md:px-6 md:py-3 rounded-2xl bg-[#2563EB] text-[#F8FAFC] font-black hover:bg-blue-700 transition-all shadow-sm text-sm md:text-base"
              >
                <Share2 className="w-5 h-5" />
                {lang === "ar" ? "تواصل معنا" : "Contact Us"}
              </motion.a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-4xl mx-auto mb-8 md:mb-12 pointer-events-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#5EEAD4]/10 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-4 md:ltr:left-6 rtl:right-4 md:rtl:right-6 h-5 w-5 md:h-6 md:w-6 text-[#CBD5E1] dark:text-[#64748B] group-focus-within:text-[#14B8A6] dark:group-focus-within:text-[#14B8A6] transition-colors" />
              <Input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={t.vault.search}
                className="ltr:pl-12 md:ltr:pl-16 rtl:pr-12 md:rtl:pr-16 h-12 md:h-20 bg-transparent dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#CBD5E1] dark:placeholder:text-[#64748B] text-base md:text-xl rounded-2xl md:rounded-[2rem] border-[#CBD5E1] dark:border-[#334155] shadow-sm transition-all focus:ring-0 focus:border-[#5EEAD4] dark:focus:border-[#14B8A6]"
              />
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible justify-start md:justify-center py-3 md:py-4 px-2 md:px-4 gap-2 md:gap-3 sticky top-16 md:top-20 z-40 bg-background/95 dark:bg-[#0B1220]/95 backdrop-blur-xl shadow-sm rounded-3xl border border-[#E2E8F0] dark:border-[#334155] custom-scrollbar pb-3">
            {dynamicCategories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={cn(
                    "flex items-center gap-1.5 md:gap-3 px-3 md:px-6 py-1.5 md:py-2.5 rounded-xl md:rounded-full border font-bold text-[11px] md:text-sm transition-all whitespace-nowrap shrink-0",
                    isActive 
                      ? "bg-[#E8FCF9] dark:bg-[#14B8A6] border-[#5EEAD4] dark:border-[#14B8A6] text-[#14B8A6] dark:text-[#0B1220] shadow-sm" 
                      : "bg-transparent dark:bg-[#0F172A] border-[#CBD5E1] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                  )}
                >
                  <span className="font-['Cairo'] tracking-wide">{lang === "ar" ? cat.nameAr : cat.nameEn}</span>
                  <span className={cn(
                    "px-1.5 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-black",
                    isActive ? "bg-[#5EEAD4]/20 dark:bg-[#0B1220]/20 text-[#14B8A6] dark:text-[#0B1220]" : "bg-slate-200 dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]"
                  )}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Course Grid */}
          <div className="space-y-10 md:space-y-16 min-h-[600px] pointer-events-auto">
            {groupedData?.map((group) => (
              <div key={group.categoryId} className="space-y-5 md:space-y-8">
                {activeTab === "all" && (
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-7 md:h-10 w-1.5 md:w-2 rounded-full bg-[#2563EB] shadow-sm" />
                    <h2 className="text-base md:text-section-title font-black text-[#0F172A] dark:text-[#F8FAFC] font-['Tajawal'] break-words">
                      {group.categoryName}
                    </h2>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
                  {group?.courses?.map((c, i) => {
                    const categoryObj = dynamicCategories.find(cat => cat.id === (c.category || "math"));
                    const Icon = categoryObj?.icon || BookOpen;

                    return (
                      <CourseCard
                        key={c.id}
                        course={c}
                        index={i}
                        icon={<Icon className="h-4 w-4 md:h-5 md:w-5" />}
                        onClick={() => navigate(`/materials/${c.id}`)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {groupedData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 pointer-events-auto"
            >
              <div className="h-24 w-24 bg-muted/10 rounded-full grid place-items-center mx-auto mb-6">
                <Search className="h-10 w-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-2xl font-black text-muted-foreground">
                {lang === "ar" ? "لا توجد نتائج مطابقة" : "No results found"}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground/60 mt-3 font-bold">
                {lang === "ar" ? "جرب البحث بكلمة أخرى أو تغيير الفئة" : "Try a different search term or category"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

