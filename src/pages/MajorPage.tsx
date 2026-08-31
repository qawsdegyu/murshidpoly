import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft, Download, Briefcase, DollarSign, BookOpen,
  GraduationCap, Sparkles, ChevronRight,
  BookMarked, Clock, CheckCircle2, TrendingUp
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { getMajorById, majorCurriculum } from "@/data/majorsData";
import { allMaterials, type Course } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// ─── Animation Variants ───────────────────────────────────────
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const SectionLabel = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg shrink-0"
      style={{ background: color }}
    >
      {icon}
    </div>
    <h3 className="text-sm md:text-base font-black tracking-tight text-foreground uppercase opacity-80">
      {label}
    </h3>
  </div>
);

const CollapsibleSection = ({ icon, label, color, children, defaultOpen = false }: { icon: React.ReactNode, label: string, color: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl md:rounded-3xl bg-card border border-border overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-6 bg-transparent hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white shadow-lg shrink-0"
            style={{ background: color }}
          >
            {icon}
          </div>
          <h3 className="text-sm md:text-lg font-black tracking-tight text-foreground uppercase opacity-90">
            {label}
          </h3>
        </div>
        <ChevronRight className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isOpen ? "rotate-90" : "rtl:rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 pt-0 border-t border-border/50 mt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function MajorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, dir, t } = usePreferences();
  if (!id) return null;
  const isAr = lang === "ar";

  const [activeYear, setActiveYear] = useState(1);
  const [activeSemester, setActiveSemester] = useState<1 | 2>(1);
  const [remoteCurriculum, setRemoteCurriculum] = useState<typeof majorCurriculum[string] | null>(null);
  const [remoteCourses, setRemoteCourses] = useState<Course[]>([]);
  const [planLoading, setPlanLoading] = useState(false);

  const major = getMajorById(id ?? "");
  const localCurriculum = majorCurriculum[id ?? ""] ?? [];
  const usesSourcePlan = ["thermal", "autotronics", "electrical", "industrial"].includes(id ?? "");
  const curriculum = usesSourcePlan ? (remoteCurriculum ?? []) : localCurriculum;

  useEffect(() => {
    let active = true;

    async function loadSourcePlan() {
      if (!usesSourcePlan) return;
      setPlanLoading(true);
      try {
        const { data: rows, error } = await supabase
          .from("curriculum_plan_entries")
          .select("id,academic_year,semester,course_name_ar,credit_hours,course_id")
          .eq("major_key", id)
          .order("academic_year", { ascending: true })
          .order("semester", { ascending: true })
          .order("id", { ascending: true });
        if (error) throw error;

        const sourceRows = rows || [];
        const sourceIds = Array.from(new Set(sourceRows.map((row: any) => row.course_id).filter(Boolean)));
        const { data: sourceCourses, error: coursesError } = sourceIds.length
          ? await supabase.from("courses").select("id,code,name_en,name_ar,credit_hours,department,category,instructors").in("id", sourceIds).limit(300)
          : { data: [], error: null };
        if (coursesError) throw coursesError;

        const courseMap = new Map<string, Course>();
        (sourceCourses || []).forEach((course: any) => {
          courseMap.set(String(course.id), {
            id: String(course.id),
            code: course.code || "",
            name: course.name_en || course.name_ar || "",
            nameAr: course.name_ar || course.name_en || "",
            hours: Number(course.credit_hours || 0),
            department: course.department || "",
            category: course.category || "general",
            instructors: course.instructors || [],
          });
        });

        const yearMap = new Map<number, Map<number, string[]>>();
        sourceRows.forEach((row: any) => {
          const entryId = String(row.id);
          const courseId = row.course_id ? String(row.course_id) : `plan-entry-${entryId}`;
          if (!courseMap.has(courseId)) {
            courseMap.set(courseId, {
              id: courseId,
              code: "",
              name: row.course_name_ar || "",
              nameAr: row.course_name_ar || "",
              hours: Number(row.credit_hours || 0),
              department: id || "",
              category: "general",
            });
          }
          if (!yearMap.has(Number(row.academic_year))) yearMap.set(Number(row.academic_year), new Map());
          const semesterMap = yearMap.get(Number(row.academic_year))!;
          if (!semesterMap.has(Number(row.semester))) semesterMap.set(Number(row.semester), []);
          semesterMap.get(Number(row.semester))!.push(courseId);
        });

        const nextCurriculum = Array.from(yearMap.entries()).sort(([a], [b]) => a - b).map(([year, semesterMap]) => ({
          year,
          labelAr: `السنة ${year}`,
          labelEn: `Year ${year}`,
          semesters: Array.from(semesterMap.entries()).sort(([a], [b]) => a - b).map(([semester, courseIds]) => ({
            semester: semester as 1 | 2,
            labelAr: semester === 1 ? "الفصل الأول" : "الفصل الثاني",
            labelEn: semester === 1 ? "Semester 1" : "Semester 2",
            courseIds,
          })),
        }));

        if (active) {
          setRemoteCurriculum(nextCurriculum);
          setRemoteCourses(Array.from(courseMap.values()));
          setActiveYear(nextCurriculum[0]?.year || 1);
          setActiveSemester(1);
        }
      } catch (error) {
        console.error("Error loading source curriculum plan", error);
        if (active) {
          setRemoteCurriculum(localCurriculum);
          setRemoteCourses([]);
        }
      } finally {
        if (active) setPlanLoading(false);
      }
    }

    void loadSourcePlan();
    return () => { active = false; };
  }, [id, usesSourcePlan]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
    return () => clearTimeout(timer);
  }, [id]);

  // Map course IDs to actual course objects
  const activeCourses = useMemo<Course[]>(() => {
    const yearData = curriculum.find((yr) => yr.year === activeYear);
    if (!yearData) return [];
    const semesterData = yearData.semesters.find((s) => s.semester === activeSemester);
    if (!semesterData) return [];

    return semesterData.courseIds.map(cid =>
      remoteCourses.find(m => m.id === cid) || allMaterials.find(m => m.id === cid)
    ).filter((c): c is Course => !!c);
  }, [curriculum, remoteCourses, activeYear, activeSemester]);

  const handleYearChange = (year: number) => {
    setActiveYear(year);
    setActiveSemester(1);
  };

  if (!major) {
    return (
      <div className='bg-background h-screen flex flex-col items-center justify-center text-foreground transition-colors duration-500'>
        <GraduationCap className="h-20 w-20 text-slate-800 mb-6 animate-pulse" />
        <h2 className="text-2xl font-black mb-4">Loading or Data not found...</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold"
        >
          {t.common.back}
        </button>
      </div>
    );
  }

  return (
    <motion.div
      dir={dir}
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-background text-foreground overflow-x-hidden pb-28"
      style={{ willChange: "transform, opacity", fontFamily: "'Cairo', 'Tajawal', 'Inter', sans-serif" }}
    >
      {/* ── Global ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[160px] opacity-[0.12] hidden md:block"
          style={{ background: major.accentColor }}
        />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.06] bg-blue-500 hidden md:block" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.05] bg-emerald-400 hidden md:block" />
      </div>

      {/* ── Hero ── */}
      <div className="relative z-10 pt-6 pb-2 md:pt-8 md:pb-4 px-5 md:px-12 max-w-7xl mx-auto">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10 blur-3xl pointer-events-none", major.color)} />
        
        <div className="max-w-7xl flex flex-col items-start w-full relative">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: dir === "rtl" ? 16 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 w-fit rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-foreground font-bold hover:bg-white/10 transition-all active:scale-95 shadow-sm mb-4 self-start"
          >
            <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "rotate-180" : "")} />
            {isAr ? "العودة" : "Back"}
          </motion.button>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] mb-4 text-foreground font-['Cairo']">
            {isAr ? major.nameAr : major.name}
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg font-bold max-w-3xl leading-relaxed">
            {isAr ? major.descriptionAr : major.description}
          </p>

          {(major.totalHours || major.committeeNameAr) && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {major.totalHours && (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-4 py-2.5 shadow-sm backdrop-blur-xl">
                  <Clock className="h-4 w-4" style={{ color: major.accentColor }} />
                  <span className="text-sm font-black text-foreground">{major.totalHours}</span>
                  <span className="text-xs font-bold text-muted-foreground">{isAr ? "ساعة" : "credit hours"}</span>
                </div>
              )}
              {major.committeeNameAr && (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/70 px-4 py-2.5 shadow-sm backdrop-blur-xl">
                  <GraduationCap className="h-4 w-4" style={{ color: major.accentColor }} />
                  <span className="text-xs font-black text-foreground">{isAr ? major.committeeNameAr : "Specialization committee"}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mt-4 md:mt-8 flex flex-col gap-3">

          {/* ── About ── */}
          <motion.section variants={fadeUp}>
            <CollapsibleSection
              icon={<BookOpen className="h-4 w-4" />}
              label={isAr ? "عن التخصص" : "About the Major"}
              color={major.accentColor}
            >
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed font-bold">
                {isAr ? major.longDescriptionAr : major.longDescription}
              </p>
            </CollapsibleSection>
          </motion.section>

          {/* ── Market & Salary ── */}
          <motion.section variants={fadeUp}>
            <CollapsibleSection
              icon={<DollarSign className="h-4 w-4" />}
              label={isAr ? "السوق والرواتب" : "Market & Salary"}
              color={major.accentColor}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price card */}
                <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] backdrop-blur-2xl shadow-sm dark:shadow-none isolation-isolate">
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none" style={{ background: major.accentColor }} />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3" style={{ background: `${major.accentColor}20`, color: major.accentColor }}>
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-3">
                      {isAr ? "سعر الساعة المعتمدة" : "Credit Hour Price"}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400">{isAr ? "التنافسي" : "Competitive"}</span>
                        </div>
                        <div className="px-2.5 py-0.5 rounded-md bg-emerald-400/10 border border-emerald-400/20">
                          <span className="text-sm font-black text-emerald-400 tabular-nums">{major.hourPriceCompetitive}</span>
                          <span className="text-[9px] font-bold text-emerald-400/70 ltr:ml-1 rtl:mr-1">{isAr ? "د.أ" : "JOD"}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400">{isAr ? "الموازي" : "Parallel"}</span>
                        </div>
                        <div className="px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20">
                          <span className="text-sm font-black text-amber-400 tabular-nums">{major.hourPriceParallel}</span>
                          <span className="text-[9px] font-bold text-amber-400/70 ltr:ml-1 rtl:mr-1">{isAr ? "د.أ" : "JOD"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary card */}
                <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] backdrop-blur-2xl shadow-sm dark:shadow-none isolation-isolate">
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20 bg-emerald-400 pointer-events-none" />
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 bg-emerald-400/15 text-emerald-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-1.5">
                      {isAr ? "الراتب المتوقع" : "Expected Salary"}
                    </div>
                    <div className="text-sm sm:text-base font-black text-foreground leading-snug">{isAr ? major.expectedSalaryAr : major.expectedSalary}</div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </motion.section>

          {/* ── Career Opportunities ── */}
          <motion.section variants={fadeUp}>
            <CollapsibleSection
              icon={<TrendingUp className="h-4 w-4" />}
              label={isAr ? "مجالات العمل" : "Career Opportunities"}
              color={major.accentColor}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(major.careerFieldsAr || []).map((field, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-foreground/90 leading-tight">{field}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </motion.section>

          {/* ── Curriculum ── */}
          <motion.section variants={fadeUp}>
            <SectionLabel
              icon={<BookMarked className="h-4 w-4" />}
              label={isAr ? "الخطة الدراسية" : "Curriculum Plan"}
              color={major.accentColor}
            />

            {planLoading && usesSourcePlan ? (
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center text-sm font-bold text-muted-foreground">
                {isAr ? "جارٍ تحميل الخطة الإرشادية..." : "Loading the source curriculum plan..."}
              </div>
            ) : curriculum.length > 0 ? (
              <div className="mt-6">
                {/* Year Selector */}
                <div className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl bg-slate-100/50 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.08]">
                  {curriculum.map((yr) => (
                    <button
                      key={yr.year}
                      onClick={() => handleYearChange(yr.year)}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
                        activeYear === yr.year
                          ? "bg-white dark:bg-white/10 text-foreground shadow-lg"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isAr ? `السنة ${yr.year}` : `Year ${yr.year}`}
                    </button>
                  ))}
                </div>

                {/* Semester Selector */}
                <div className="flex gap-3 mb-8">
                  {[1, 2].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setActiveSemester(sem as 1 | 2)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border font-black transition-all text-xs sm:text-sm",
                        activeSemester === sem
                          ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10"
                          : "border-border text-muted-foreground hover:border-muted-foreground/30 bg-card/50"
                      )}
                    >
                      {isAr ? `الفصل ${sem}` : `Semester ${sem}`}
                    </button>
                  ))}
                </div>

                {/* Courses Grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeYear}-${activeSemester}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {activeCourses.map((course, idx) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        index={idx}
                        accentColor={major.accentColor}
                        onClick={() => navigate(`/materials/${course.id}`)}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center px-6 bg-slate-100 dark:bg-white/[0.02] rounded-3xl border border-dashed border-border">
                <Clock className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">
                  {isAr ? "سيتم إضافة الخطة الدراسية قريباً" : "Curriculum plan will be added soon."}
                </p>
              </div>
            )}
          </motion.section>

          {/* ── Download CTA ── */}
          <motion.section variants={fadeUp}>
            <SectionLabel
              icon={<Download className="h-4 w-4" />}
              label={isAr ? "الخطة الرسمية" : "Official PDF"}
              color={major.accentColor}
            />
            <div className="mt-4">
              {major.studyPlanUrl ? (
                <a
                  href={major.studyPlanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between p-5 md:p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 border border-white/10 shadow-2xl overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                      <Download className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="text-start">
                      <div className="text-[10px] font-black text-white/70 tracking-[0.18em] uppercase mb-0.5">
                        {isAr ? "تحميل مباشر — PDF رسمي" : "Direct Download — Official PDF"}
                      </div>
                      <div className="text-sm md:text-base font-black text-white">
                        {isAr ? "تحميل الخطة الدراسية" : "Download Study Plan"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                </a>
              ) : (
                <div className="flex items-center gap-5 px-8 py-6 rounded-full bg-white dark:bg-white/[0.03] border border-dashed border-slate-200 dark:border-white/[0.10] shadow-sm dark:shadow-none">
                  <Download className="h-8 w-8 text-slate-400 dark:text-slate-600 shrink-0" />
                  <div className="text-muted-foreground font-medium text-sm md:text-base">
                    {isAr ? "الخطة الدراسية غير متاحة حالياً" : "Official study plan is currently unavailable for this major."}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

      </div>
    </motion.div>
  );
}
