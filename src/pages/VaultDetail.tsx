import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, FileText, BookMarked, FileCheck, Brain, Download, User,
  GraduationCap, Mail, Phone, Copy, MapPin, Eye, Youtube, MessageCircle,
  Share2, Upload, Play, Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Resource,
  courses
} from "@/data/mockData";
import { roadmapNodes } from "@/data/roadmapData";
import { supabase } from "@/lib/supabase";
import { usePreferences } from "@/contexts/PreferencesContext";
import MaterialList from "@/components/MaterialList";
import { facultyList, FacultyMember } from "@/data/facultyData";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import VaultSkeleton from "@/components/skeletons/VaultSkeleton";
import ShareButton from "@/components/ShareButton";
import ErrorBoundary from "@/components/ErrorBoundary";

function InstructorCards({ department, courseName }: { department: string; courseName: string }) {
  const { t, lang, dir } = usePreferences();
  const [search, setSearch] = useState("");

  const getMappedDepartments = (courseDept: string): string[] => {
    const dept = courseDept.toLowerCase();
    if (dept.includes("general") || dept.includes("basic science")) {
      return ["قسم العلوم الاساسية العلمية", "قسم العلوم الانسانية", "قسم العلوم الاساسية الانسانية"];
    }
    if (dept.includes("computer")) return ["قسم هندسة الحاسوب", "قسم الهندسة الكهربائية"];
    if (dept.includes("electrical")) return ["قسم الهندسة الكهربائية"];
    if (dept.includes("mechanical")) return ["قسم الهندسة الميكانيكية", "قسم هندسة الميكاترونكس"];
    if (dept.includes("civil")) return ["قسم الهندسة المدنية"];
    if (dept.includes("chemical")) return ["قسم الهندسة الكيميائية"];
    if (dept.includes("industrial")) return ["قسم الهندسة الميكانيكية"];
    if (dept.includes("mechatronics")) return ["قسم هندسة الميكاترونكس", "قسم الهندسة الميكانيكية"];
    return ["كلية الهندسة التكنولوجية"];
  };

  const targetDepts = getMappedDepartments(department);
  const filteredList = facultyList.filter(f => {
    const matchesDept = targetDepts.some(d => f.department.includes(d) || d.includes(f.department));
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const copy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(lang === "ar" ? "تم نسخ البريد الإلكتروني" : "Email copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="relative group">
        <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          placeholder={lang === "ar" ? "ابحث عن مدرس..." : "Search for an instructor..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-surface/50 border border-border backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
        />
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-12 bg-surface/30 rounded-3xl border border-dashed border-border">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm font-medium">
            {lang === "ar" ? "لا يوجد بيانات تواصل حالياً لهذا الاسم" : "No contact information available for this name"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList?.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden bg-surface/40 border border-border/60 backdrop-blur-2xl rounded-2xl p-5 hover:border-accent/30 hover:bg-surface/60 transition-all duration-300 isolation-isolate"
            >
              <div className="flex items-start justify-between gap-4 pointer-events-none">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-accent/20 flex items-center justify-center text-accent font-black text-lg shrink-0 shadow-lg">
                    {f.name.split(" ").filter(n => n.length > 2)[0]?.[0] || "د"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground group-hover:text-accent transition-colors truncate">
                      {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                      {f.department}
                    </p>
                  </div>
                </div>

                {f.email && (
                  <div className="flex gap-1.5 shrink-0 pointer-events-auto">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copy(f.email)}
                      className="h-8 w-8 rounded-lg bg-surface/50 border border-border flex items-center justify-center text-content/50 hover:text-accent hover:border-accent/30 transition-all"
                      title="Copy Email"
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={`mailto:${f.email}`}
                      className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </motion.a>
                  </div>
                )}
              </div>

              {/* Teams Tip */}
              <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/5 bg-blue-50/30 dark:bg-blue-900/5 rounded-xl p-3 flex gap-2.5 rtl:text-right" dir="rtl">
                <div className="shrink-0 w-6 h-6 rounded-md bg-[#4B53BC] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-accent-foreground fill-current">
                    <path d="M12.5 13.5C12.5 14.88 11.38 16 10 16C8.62 16 7.5 14.88 7.5 13.5C7.5 12.12 8.62 11 10 11C11.38 11 12.5 12.12 12.5 13.5ZM17 12V16.5C17 17.33 16.33 18 15.5 18H12.75L10 21V18H10C7.79 18 6 16.21 6 14C6 11.79 7.79 10 10 10H15.5C16.33 10 17 10.67 17 11.5V12ZM21 8.5C21 9.33 20.33 10 19.5 10H19V11.5C19 12.08 18.78 12.61 18.42 13C18.79 13 19 13.47 19 14V14.5C19 15.33 18.33 16 17.5 16H17V11.5C17 10.12 15.88 9 14.5 9H10C10 7.34 11.34 6 13 6H19.5C20.33 6 21 6.67 21 7.5V8.5Z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] font-bold text-[#4B53BC] dark:text-blue-400">
                    ملاحظة: حساب التيمز هو نفس البريد الجامعي {f.email ? `(${f.email.split('@')[0]})` : ''}.
                  </p>
                  {f.email && (
                    <p className="text-[9px] text-muted-foreground leading-tight">
                      يمكنك التواصل عبر Teams باستخدام اليوزر (Username) بدون @bau.edu.jo
                    </p>
                  )}
                </div>
              </div>

              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine pointer-events-none" />
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  );
}

const TAB_KEYS = ["summaries", "books", "exams", "videos"] as const;
type TabKey = typeof TAB_KEYS[number];

function VaultDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { t, lang, dir } = usePreferences();
  const [course, setCourse] = useState<any>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<TabKey | null>(null);
  const [showInstructors, setShowInstructors] = useState(false);

  const findRoadmapNode = (courseCode: string, courseId: string) => {
    const cleanCode = (courseCode || "").replace(/\s+/g, "").toLowerCase();
    const cleanId = (courseId || "").replace(/\s+/g, "").toLowerCase();

    return roadmapNodes.find(node => {
      const nodeCleanId = node.id.replace(/\s+/g, "").toLowerCase();
      return nodeCleanId === cleanCode || nodeCleanId === cleanId;
    });
  };

  const getPrerequisitesDetails = (node: any) => {
    if (!node || !node.prerequisites) return [];
    return node.prerequisites.map((prereqId: string) => {
      const prereqNode = roadmapNodes.find(n => n.id.toLowerCase() === prereqId.toLowerCase());
      const mockCourse = courses.find(c => c.id.toLowerCase() === prereqId.toLowerCase() || c.code.replace(/\s+/g, "").toLowerCase() === prereqId.toLowerCase());
      const fallbackNameAr = mockCourse?.nameAr || prereqNode?.fallbackNameAr || prereqId;
      const fallbackNameEn = mockCourse?.name || prereqNode?.fallbackName || prereqId;
      
      return {
        id: mockCourse?.id || prereqId,
        nameAr: fallbackNameAr,
        nameEn: fallbackNameEn,
        code: mockCourse?.code || prereqId.toUpperCase()
      };
    });
  };

  const getUnlocksDetails = (nodeId: string) => {
    if (!nodeId) return [];
    const lowerNodeId = nodeId.toLowerCase();
    return roadmapNodes
      .filter(n => n.prerequisites.some(p => p.toLowerCase() === lowerNodeId))
      .map(n => {
        const mockCourse = courses.find(c => c.id.toLowerCase() === n.id.toLowerCase() || c.code.replace(/\s+/g, "").toLowerCase() === n.id.toLowerCase());
        return {
          id: mockCourse?.id || n.id,
          nameAr: mockCourse?.nameAr || n.fallbackNameAr || n.id,
          nameEn: mockCourse?.name || n.fallbackName || n.id,
          code: mockCourse?.code || n.id.toUpperCase()
        };
      });
  };

  useEffect(() => {
    let active = true;

    async function fetchCourseData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data: courseData } = await supabase.from('courses').select('*').eq('id', id).single();
        
        if (!active) return;

        if (courseData) {
          setCourse({
            id: courseData.id,
            code: courseData.code,
            nameEn: courseData.name_en,
            nameAr: courseData.name_ar,
            hours: courseData.credit_hours,
            department: courseData.department,
            category: courseData.category,
            instructors: courseData.instructors || []
          });
          const cleanCode = courseData.code.replace(/\s+/g, '').toLowerCase();
          const slugName = (courseData.name_en || "").toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');

          // Helper to sanitize parameters for PostgREST .or() filter
          const sanitizeForOr = (text: string) => {
            if (!text) return "";
            return text.replace(/[#"(),]/g, " ").replace(/\s+/g, " ").trim();
          };

          const safeCleanCode = sanitizeForOr(cleanCode);
          const safeCode = sanitizeForOr(courseData.code);
          const safeSlug = sanitizeForOr(slugName);
          const safeNameAr = sanitizeForOr(courseData.name_ar);
          const safeNameEn = sanitizeForOr(courseData.name_en);

          // Build a safe filter enclosing values in double quotes
          let orFilter = `course_id.eq.${courseData.id}`;
          if (safeCleanCode) orFilter += `,course_id.eq."${safeCleanCode}"`;
          if (safeCode) orFilter += `,course_id.eq."${safeCode}"`;
          if (safeSlug) orFilter += `,course_id.eq."${safeSlug}"`;
          if (safeNameAr) orFilter += `,title.ilike."%${safeNameAr}%"`;
          if (safeNameEn) orFilter += `,title.ilike."%${safeNameEn}%"`;

          console.log("Fetching resources for course:", courseData.code, "with filters:", orFilter);

          const { data: resourceData, error: resError } = await supabase
            .from('resources')
            .select('*')
            .or(orFilter);

          if (!active) return;

          if (resError) {
            console.error("Supabase Resources Fetch Error:", resError);
            toast.error(isAr ? "فشل جلب المصادر من قاعدة البيانات" : "Failed to fetch resources from DB");
          }

          let finalResources: Resource[] = [];

          if (resourceData && resourceData.length > 0) {
            console.log("Using Supabase resources:", resourceData.length);
            finalResources = resourceData as Resource[];
          } else {
            console.log("No Supabase resources found, checking mock data fallback...");
            const { resourcesByCourse } = await import("@/data/mockData");
            if (!active) return;
            finalResources = resourcesByCourse[id] ||
              resourcesByCourse[courseData.code] ||
              resourcesByCourse[cleanCode] ||
              resourcesByCourse[slugName] || [];
            console.log("Fallback resources found:", finalResources.length);
          }

          setResources(finalResources);

          // Auto-select first tab that has data (for both DB and Fallback)
          if (finalResources.length > 0) {
            const types: TabKey[] = ["summaries", "books", "exams", "videos"];
            for (const tKey of types) {
              const typeToFilter = tKey === "summaries" ? "summary" : tKey === "books" ? "book" : tKey === "exams" ? "exam" : "video";
              const typeMap: Record<string, string[]> = {
                summary: ["summary", "ملخص", "دوسية", "تخليص", "نوتات"],
                book: ["book", "كتاب", "مرجع"],
                exam: ["exam", "امتحان", "اسئلة", "سنوات"],
                video: ["video", "فيديو", "شرح", "شروحات"]
              };
              const allowedTypes = typeMap[typeToFilter];
              const hasData = finalResources.some(r => {
                const rType = (r.type || "").toLowerCase().trim();
                return allowedTypes.some(at => rType.includes(at) || at.includes(rType));
              });
              if (hasData) {
                setTab(tKey);
                break;
              }
            }
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    fetchCourseData();

    return () => {
      active = false;
    };
  }, [id, lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
    return () => clearTimeout(timer);
  }, [id, isLoading]);

  const isAr = lang === "ar";

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-32">
        <div className="bg-surface/90 border border-border shadow-elegant backdrop-blur-xl rounded-[3rem] p-8 md:p-16 mb-10">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-16 md:h-24 w-full" />
        </div>
        <VaultSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-black text-foreground mb-2">
          {isAr ? "عذراً، هذه المادة غير متوفرة" : "Sorry, course not found"}
        </h2>
        <Button onClick={() => nav(-1)}>{t.common.back}</Button>
      </div>
    );
  }

  const filterType = (type: string) => {
    const typeMap: Record<string, string[]> = {
      summary: ["summary", "ملخص", "دوسية", "تخليص", "نوتات"],
      book: ["book", "كتاب", "مرجع"],
      exam: ["exam", "امتحان", "اسئلة", "سنوات"],
      video: ["video", "فيديو", "شرح", "شروحات"]
    };
    const allowedTypes = typeMap[type.toLowerCase()] || [type.toLowerCase()];
    const filtered = resources.filter(r => {
      const rType = (r.type || "").toLowerCase().trim();
      return allowedTypes.some(at => rType.includes(at) || at.includes(rType));
    });
    console.log(`Filtering for ${type}, found ${filtered.length} items out of ${resources.length}`);
    return filtered;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen w-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-[#F8FAFC] dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A]"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-20">
      {/* Top Action Bar - Back Button */}
      <div className="flex justify-between items-center mb-8 pt-20">
        <ShareButton 
          title={isAr ? `شوف هاي المادة على Hadeed: ${course?.nameAr}` : `Check out this course on Hadeed: ${course?.nameEn}`} 
          label={isAr ? "شارك المادة" : "Share Course"}
        />
        <button
          onClick={() => nav(-1)}
          className="group inline-flex items-center gap-3 text-lg md:text-2xl font-black text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-all"
        >
          <span className="uppercase tracking-[0.2em]">{t.common.back}</span>
          <ArrowLeft className={cn("w-7 h-7 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform", dir === "rtl" ? "" : "rotate-180")} />
        </button>
      </div>

      {/* Course header */}
      <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm rounded-3xl md:rounded-[3rem] p-5 md:p-16 mb-6 md:mb-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -z-10 rounded-full group-hover:bg-primary/10 transition-colors hidden md:block" />
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-6">
          <span className="text-[10px] md:text-sm font-black tracking-[0.2em] md:tracking-[0.3em] uppercase px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl bg-[#E8FCF9] dark:bg-[#0F172A] text-[#14B8A6] dark:text-[#14B8A6]">
            {course.code}
          </span>
          <span className="text-[10px] md:text-sm font-black uppercase text-[#64748B] dark:text-[#94A3B8] tracking-widest">
            {course.department} • {course.hours} {isAr ? "ساعات" : "hrs"}
          </span>
          {course.instructors && course.instructors.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-amber-500/5 border border-amber-500/10">
              <GraduationCap className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500" />
              <span className="text-[9px] md:text-xs font-black text-amber-600/80 uppercase tracking-wider">
                {isAr ? "المدرسين: " : "Instructors: "}
                {Array.isArray(course.instructors) ? course.instructors.join(" • ") : course.instructors}
              </span>
            </div>
          )}
        </div>
        <h1 className="text-xl md:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tighter leading-tight break-words font-['Cairo']">
          {isAr ? course.nameAr : course.nameEn}
        </h1>
      </div>



      {/* Tabs */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center md:items-center mb-12 gap-2 md:gap-3">
        {TAB_KEYS.map((k) => {
          const isActive = tab === k;
          const config = {
            summaries: { icon: FileText, label: t.vault.tabs.summaries, color: "#3b82f6" },
            books: { icon: BookMarked, label: t.vault.tabs.books, color: "#a855f7" },
            exams: { icon: FileCheck, label: t.vault.tabs.exams, color: "#10b981" },
            videos: { icon: Youtube, label: t.vault.tabs.videos, color: "#f43f5e" },
          }[k];

          return (
            <button
              key={k}
              onClick={() => setTab(isActive ? null : k)}
              className={cn(
                "relative flex items-center justify-center gap-1.5 md:gap-2.5 px-3 py-2.5 md:px-6 md:py-3.5 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black transition-all duration-300 group overflow-hidden w-full md:w-auto",
                isActive
                  ? "bg-[#2563EB] text-[#F8FAFC] shadow-sm scale-102 md:scale-105"
                  : "text-[#64748B] dark:text-[#94A3B8] bg-transparent dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155]"
              )}
            >
              <config.icon className={cn("relative z-10 w-4 h-4 md:w-5 md:h-5", isActive && "scale-110 md:scale-125")} />
              <span className="relative z-10 truncate">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Animated panel area */}
      <div className="relative min-h-[50vh]">
        <AnimatePresence mode="wait">
          {!tab ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="flex flex-col items-center justify-center py-24 bg-surface/20 border border-dashed border-border/40 rounded-[4rem]"
            >
              <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 animate-bounce-slow">
                <Brain className="w-12 h-12 text-primary dark:text-accent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">
                {isAr ? "استكشف محتويات المادة" : "Explore course content"}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground font-bold max-w-md text-center px-6 leading-relaxed opacity-60">
                {isAr ? "اختر أحد الأقسام أعلاه لعرض الملفات والملخصات المتوفرة" : "Select one of the sections above to view available files and summaries"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <MaterialList
                items={filterType(tab === "summaries" ? "summary" : tab === "books" ? "book" : tab === "exams" ? "exam" : "video")}
                emptyMessage={isAr ? "جاري العمل على إضافة المحتوى لهذا القسم ✨" : "Working on adding content for this section ✨"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}

      {/* Contribute Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-10 md:p-16 rounded-[4rem] bg-surface/90 border border-border shadow-elegant backdrop-blur-2xl relative overflow-hidden group transition-all duration-700 mb-32"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-8 text-center lg:text-start flex-col lg:flex-row">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform duration-500">
              <Upload className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-black text-foreground mb-2 tracking-tight">
                {lang === "ar" ? "شاركنا ملفاتك أو روابطك" : "Share your files or links"}
              </h4>
              <p className="text-sm md:text-base text-muted-foreground/70 font-medium max-w-xl leading-relaxed">
                {lang === "ar" ? "ساهم في إثراء محتوى هذه المادة وساعد زملائك في بناء مستقبل هندسي أفضل." : "Contribute to this course and help your peers build a better engineering future."}
              </p>
            </div>
          </div>

          <motion.a
            href={`https://api.whatsapp.com/send?phone=962785159906&text=${encodeURIComponent(isAr ? `مرحباً مرشد، أريد مشاركة ملفات لمادة: ${course.nameAr}` : `Hello Murshid, I want to share files for: ${course.nameEn}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-black text-sm md:text-base hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/30 whitespace-nowrap"
          >
            <Share2 className="w-5 h-5" />
            {lang === "ar" ? "تواصل معنا عبر واتساب" : "Contact on WhatsApp"}
          </motion.a>
        </div>
      </motion.section>
      </div>
    </motion.div>
  );
}

export default function VaultDetailPage() {
  return (
    <ErrorBoundary>
      <VaultDetail />
    </ErrorBoundary>
  );
}
