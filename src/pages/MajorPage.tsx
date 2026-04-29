/**
 * MajorPage.tsx — Premium Apple/Linear/Vercel-inspired design
 * Route: /major/:id
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  ArrowLeft, Download, Briefcase, DollarSign, BookOpen,
  GraduationCap, CheckCircle2, Sparkles, ChevronRight,
  FileText, BookMarked, FlaskConical, ScrollText,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { getMajorById, majorCurriculum } from "@/data/majorsData";
import { allMaterials, resourcesByCourse } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

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

const stagger: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function MajorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, dir, t } = usePreferences();
  if (!id) return null;
  const isAr = lang === "ar";
  const [activeYear, setActiveYear] = useState(1);
  const [activeSemester, setActiveSemester] = useState<1 | 2>(1);

  const major = getMajorById(id ?? "");
  const curriculum = majorCurriculum[id ?? ""] ?? [];

  // Reset semester to 1 when year changes to ensure consistency
  const handleYearChange = (year: number) => {
    setActiveYear(year);
    setActiveSemester(1);
  };

  if (!major || !id) {
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

  const Icon =
    (LucideIcons as any)[major.icon] ||
    GraduationCap;

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: "transform, opacity", fontFamily: "'Cairo', 'Tajawal', 'Inter', sans-serif" }}
      className="min-h-screen bg-background text-foreground overflow-x-hidden pb-28"
    >
      {/* ── Global ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Solid theme-aware background — no grid */}
        {/* Accent glow blobs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[160px] opacity-[0.12] hidden md:block"
          style={{ background: major.accentColor }}
        />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.06] bg-blue-500 hidden md:block" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.05] bg-emerald-400 hidden md:block" />
      </div>

      {/* ── Hero ── */}
      <div className="relative z-10 h-[320px] md:h-[560px] overflow-hidden">
        <img
          src={major?.imageUrl}
          alt={isAr ? major?.nameAr : major?.name}
          className="w-full h-full object-cover"
        />
        {/* Hero overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 dark:from-black dark:via-black/80 dark:to-transparent" />
        {/* Color tint */}
        <div
          className={cn("absolute inset-0 bg-gradient-to-br opacity-25 mix-blend-overlay", major.color)}
        />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: dir === "rtl" ? 16 : -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate(-1)}
          className={cn(
            "absolute top-6 z-20 flex items-center gap-2 px-5 py-2.5",
            "rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.10]",
            "text-slate-300 text-sm font-bold backdrop-blur-xl transition-all duration-300",
            dir === "rtl" ? "right-6" : "left-6"
          )}
        >
          <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "rotate-180" : "")} />
          {isAr ? "العودة" : "Back"}
        </motion.button>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 md:px-12 pb-6 md:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* BAU badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl mb-3 md:mb-5">
              <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" style={{ color: major.accentColor }} />
              <span className="text-[9px] md:text-[11px] font-black tracking-[0.2em] uppercase text-white/70">
                {isAr ? "كلية الهندسة التكنولوجية — BAU" : "Faculty of Engineering Technology — BAU"}
              </span>
            </div>

            {/* Major title — gradient text */}
            <h1
              className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-2 md:mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${major?.accentColor} 50%, #60a5fa 100%)`,
              }}
            >
              {isAr ? major?.nameAr : major?.name}
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-sm md:text-xl font-medium max-w-2xl leading-relaxed">
              {isAr ? major.descriptionAr : major.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 mt-12 space-y-8"
      >
        {/* ── About Section ── */}
        <motion.section variants={fadeUp}>
          <SectionLabel
            icon={<BookOpen className="h-4 w-4" />}
            label={isAr ? "عن التخصص" : "About the Major"}
            color={major.accentColor}
          />
          <div className="mt-3 md:mt-4 p-5 md:p-9 rounded-2xl md:rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] backdrop-blur-2xl shadow-sm dark:shadow-none">
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-lg leading-[1.8] md:leading-[2.1] font-medium">
              {isAr ? major.longDescriptionAr : major.descriptionAr}
            </p>
          </div>
        </motion.section>

        {/* ── Bento Grid: Financials + Career ── */}
        <motion.section variants={fadeUp}>
          <SectionLabel
            icon={<DollarSign className="h-4 w-4" />}
            label={isAr ? "المالية والمسار المهني" : "Financials & Career Path"}
            color={major.accentColor}
          />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Hour Price */}
            <motion.div
              variants={stagger}
              whileHover={{ y: -2, transition: { duration: 0.25 } }}
              className="relative overflow-hidden p-5 md:p-7 rounded-2xl md:rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] backdrop-blur-2xl shadow-sm dark:shadow-none isolation-isolate"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
                style={{ background: major.accentColor }} 
              />
              <div className="relative pointer-events-none">
                <div
                  className="inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-4"
                  style={{ background: `${major.accentColor}20`, color: major.accentColor }}
                >
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mb-4">
                  {isAr ? "سعر الساعة المعتمدة" : "Credit Hour Price"}
                </div>
                
                <div className="space-y-4">
                  {/* Competitive */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-400">{isAr ? "التنافسي" : "Competitive"}</span>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                      <span className="text-lg font-black text-emerald-400 tabular-nums">{major.hourPriceCompetitive}</span>
                      <span className="text-[10px] font-bold text-emerald-400/70 ltr:ml-1 rtl:mr-1">{isAr ? "د.أ" : "JOD"}</span>
                    </div>
                  </div>

                  {/* Parallel */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold text-slate-400">{isAr ? "الموازي" : "Parallel"}</span>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20">
                      <span className="text-lg font-black text-amber-400 tabular-nums">{major.hourPriceParallel}</span>
                      <span className="text-[10px] font-bold text-amber-400/70 ltr:ml-1 rtl:mr-1">{isAr ? "د.أ" : "JOD"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Expected Salary */}
            <motion.div
              variants={stagger}
              whileHover={{ y: -2, transition: { duration: 0.25 } }}
              className="relative overflow-hidden p-7 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] backdrop-blur-2xl shadow-sm dark:shadow-none isolation-isolate"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-20 bg-emerald-400 pointer-events-none" />
              <div className="relative pointer-events-none">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-4 bg-emerald-400/15 text-emerald-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mb-2">
                  {isAr ? "الراتب المتوقع" : "Expected Salary"}
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-slate-100 [data-theme=pink]:text-rose-950 leading-snug">{major.expectedSalaryAr}</div>
              </div>
            </motion.div>

            {/* Career Fields — full width */}
            <motion.div
              variants={stagger}
              whileHover={{ y: -1, transition: { duration: 0.25 } }}
              className="relative overflow-hidden p-5 md:p-9 rounded-2xl md:rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] backdrop-blur-2xl md:col-span-2 shadow-sm dark:shadow-none isolation-isolate"
            >
              <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full blur-3xl opacity-10 bg-blue-400 pointer-events-none" />
              <div className="relative pointer-events-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-400/15 text-blue-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    {isAr ? "مجالات العمل والوظائف" : "Career Fields"}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {major?.careerFieldsAr?.map((field, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] group hover:border-slate-300 dark:hover:border-white/[0.14] transition-colors duration-300"
                    >
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110"
                        style={{ color: major.accentColor }}
                      />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 [data-theme=pink]:text-rose-900 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                        {field}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Year & Semester Curriculum ── */}
        {curriculum.length > 0 && (
          <motion.section variants={fadeUp}>
            <SectionLabel
              icon={<BookMarked className="h-4 w-4" />}
              label={isAr ? "المنهج الدراسي" : "Curriculum"}
              color={major.accentColor}
            />

            {/* Tier 1: Year Tabs - Upgraded to Wrapping Chips */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2 p-1.5 rounded-2xl bg-slate-100/50 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.08]">
              {curriculum?.map((yr) => (
                <button
                  key={yr.year}
                  onClick={() => handleYearChange(yr.year)}
                  className={cn(
                    "relative px-5 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all duration-300 z-10",
                    activeYear === yr.year
                      ? "text-white shadow-lg"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-white/5 border border-transparent hover:border-slate-200"
                  )}
                >
                  {activeYear === yr.year && (
                    <motion.span
                      layoutId={`year-pill-${major.id}`}
                      className="absolute inset-0 rounded-xl z-[-1]"
                      style={{ background: major.accentColor }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                  {isAr ? yr.labelAr : yr.labelEn}
                </button>
              ))}
            </div>

            {/* Tier 2: Semester Selection - Upgraded to Wrapping Chips */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              {[1, 2]?.map((sem) => (
                <button
                  key={sem}
                  onClick={() => setActiveSemester(sem as 1 | 2)}
                  className={cn(
                    "relative px-6 py-2.5 rounded-2xl text-[10px] md:text-xs font-black transition-all duration-500 border overflow-hidden",
                    activeSemester === sem
                      ? "text-white border-white/20 bg-slate-900 dark:bg-white/[0.15]"
                      : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                  )}
                >
                  {activeSemester === sem && (
                    <motion.div
                      layoutId={`sem-glow-${major.id}`}
                      className="absolute inset-0 z-0 opacity-40 blur-xl"
                      style={{ background: major.accentColor }}
                    />
                  )}
                  <span className="relative z-10 uppercase tracking-widest">
                    {sem === 1 ? (isAr ? "الفصل الأول" : "First Semester") : (isAr ? "الفصل الثاني" : "Second Semester")}
                  </span>
                </button>
              ))}
            </div>


            {/* Course Grid */}
            <AnimatePresence mode="wait">
              {(() => {
                const yearData = curriculum.find(yr => yr.year === activeYear);
                const semesterData = yearData?.semesters.find(s => s.semester === activeSemester);
                
                // Safe mapping with strict filtering for orphaned IDs
                const validCourses = (semesterData?.courseIds || [])
                  .map(cid => allMaterials?.find(c => c.id === cid))
                  .filter((c): c is NonNullable<typeof c> => !!c) || [];

                if (validCourses.length === 0) {
                  return (
                    <motion.div
                      key={`empty-${activeYear}-${activeSemester}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-8 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-slate-100 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/[0.1] -z-10" />
                      <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                        <div 
                          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                          style={{ background: `${major.accentColor}15` }}
                        >
                          <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: major.accentColor }} />
                          <LucideIcons.Layers className="h-10 w-10 relative z-10" style={{ color: major.accentColor }} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-slate-200 mb-2">
                          {isAr ? "سيتم إضافة مواد هذا التخصص قريباً" : "Materials coming soon"}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-500 text-sm max-w-xs font-medium">
                          {isAr 
                            ? "نحن نعمل على جمع وتنقيح أفضل المصادر الدراسية لهذا القسم." 
                            : "We are working on collecting and curating the best academic resources for this section."}
                        </p>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={`${activeYear}-${activeSemester}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                    className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                  >
                    {validCourses?.map((course, i) => (
                      <CourseCard
                        key={course?.id || i}
                        course={course}
                        index={i}
                        accentColor={major.accentColor}
                        onClick={() => navigate(`/materials/${course?.id}`)}
                      />
                    ))}
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.section>
        )}

        {/* ── Download CTA ── */}
        <motion.section variants={fadeUp}>
          <SectionLabel
            icon={<Download className="h-4 w-4" />}
            label={isAr ? "الخطة الدراسية" : "Official Study Plan"}
            color={major.accentColor}
          />
          <div className="mt-4">
            {major.studyPlanUrl ? (
              <motion.a
                href={major.studyPlanUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  y: -3,
                  boxShadow: `0 20px 60px ${major.accentColor}55`,
                }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between gap-4 md:gap-6 w-full px-6 md:px-10 py-5 md:py-7 rounded-2xl md:rounded-full relative overflow-hidden transition-all duration-300 isolation-isolate"
                style={{
                  background: `linear-gradient(135deg, ${major.accentColor}dd 0%, ${major.accentColor}99 100%)`,
                  boxShadow: `0 8px 32px ${major.accentColor}44`,
                }}
              >
                {/* Shine sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

                <div className="flex items-center gap-5 relative z-10 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Download className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-start">
                    <div className="text-xs font-black text-white/70 tracking-[0.18em] uppercase mb-1">
                      {isAr ? "تحميل مباشر — PDF رسمي" : "Direct Download — Official PDF"}
                    </div>
                    <div className="text-xl md:text-2xl font-black text-white">
                      {isAr ? "تحميل الخطة الدراسية" : "Download Study Plan"}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "h-7 w-7 text-white/70 relative z-10 group-hover:translate-x-1 transition-transform duration-300 shrink-0",
                    dir === "rtl" ? "rotate-180" : ""
                  )}
                />
              </motion.a>
            ) : (
              <div className="flex items-center gap-5 px-8 py-6 rounded-full bg-white dark:bg-white/[0.03] border border-dashed border-slate-200 dark:border-white/[0.10] shadow-sm dark:shadow-none">
                <Download className="h-8 w-8 text-slate-400 dark:text-slate-600 shrink-0" />
                <div>
                  <div className="font-black text-slate-900 dark:text-slate-500 [data-theme=pink]:text-rose-950">
                    {isAr ? "الخطة الدراسية غير متاحة حالياً" : "Study plan not available yet"}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-600 mt-0.5">
                    {isAr ? "سيتم إضافتها قريباً" : "Coming soon"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}

// ─── Section Label ─────────────────────────────────────────────
function SectionLabel({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <span
        className="text-[10px] font-black uppercase tracking-[0.24em]"
        style={{ color }}
      >
        {label}
      </span>
      <div className="h-px flex-1 opacity-15" style={{ background: color }} />
    </div>
  );
}
