import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  ArrowLeft, BookOpen, GraduationCap, Sparkles, Award,
  Briefcase, Banknote, BookMarked, TrendingUp, ChevronRight,
  Layers, MapPin, LayoutGrid
} from "lucide-react";
import { majors, courses, resourcesByCourse } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";

/* ── First-year courses configuration ── */
const firstYearCourseIds = [
  "c6", "c2", "p101", "p102", "chem101", "cs101", "plab101", "eng99",
  "national_studies", "islamic_culture", "entrepreneurship",
  "military_science", "english101", "english102", "applied_arabic",
  "engineering_workshop", "programming_cpp", "ee201", "stat101", "isl101"
];

const courseCategoryMap: Record<string, string> = {
  programming_cpp: "engineering",
  engineering_workshop: "engineering",
  national_studies: "humanities",
  entrepreneurship: "humanities",
  ee201: "humanities",
  english101: "languages",
  english102: "languages",
  applied_arabic: "languages",
  military_science: "military_islamic",
  islamic_culture: "military_islamic",
  c6: "engineering",
  c2: "engineering",
  p101: "engineering",
  p102: "engineering",
  chem101: "engineering",
  stat101: "humanities",
  isl101: "military_islamic",
};

const courseIcons: Record<string, string> = {
  programming_cpp: "Code2",
  engineering_workshop: "Wrench",
  national_studies: "Flag",
  entrepreneurship: "Lightbulb",
  ee201: "Banknote",
  english101: "Languages",
  english102: "Languages",
  applied_arabic: "Type",
  military_science: "Shield",
  islamic_culture: "GraduationCap",
  c6: "Calculator",
  c2: "Calculator",
  p101: "Zap",
  p102: "Zap",
  chem101: "TestTube",
  stat101: "BarChart2",
  isl101: "BookOpen",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

/* ════════════════════════════════════════════════════════ */
export default function MajorDetail() {
  const { id } = useParams();
  const nav     = useNavigate();
  const { lang, dir, t } = usePreferences();
  const ar      = lang === "ar";

  const major = majors.find((m) => m.id === id);
  console.log("MajorDetail rendering for id:", id, "Major found:", !!major);

  if (!major || !id) {
    console.log("MajorDetail: Data not found, showing fallback UI");
    return (
      <div className='bg-slate-50 dark:bg-slate-950 h-screen flex flex-col items-center justify-center text-slate-900 dark:text-slate-100 transition-colors duration-300'>
        <GraduationCap className="h-20 w-20 text-slate-300 dark:text-slate-800 mb-6 animate-pulse" />
        <h2 className="text-2xl font-black mb-4">Loading or Data not found...</h2>
        <button 
          onClick={() => nav(-1)}
          className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold"
        >
          {t.common.back}
        </button>
      </div>
    );
  }

  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[major.icon] || GraduationCap;

  const name     = ar ? major.nameAr        : major.name;
  const longDesc = ar ? major.longDescriptionAr : major.longDescription;
  const degrees  = ar ? major.degreesAr     : major.degrees;
  const fields   = ar ? major.fieldsAr      : major.fields;

  /* Split comma/Arabic-comma separated lists into badge arrays */
  const degreeBadges = (degrees || "").split(/[،,]/).map(s => s.trim()).filter(Boolean);
  const fieldBadges  = (fields || "").split(/[،,]/).map(s => s.trim()).filter(Boolean);

  /* Structured salary cards */
  const salaryCards = [
    {
      labelAr: "الأردن",      labelEn: "Jordan",         flag: "🇯🇴",
      value: major.salaryJordanAr || "—",
      note: ar ? "دينار أردني / شهرياً" : "JOD / month",
      color: "from-rose-500 to-pink-600",
    },
    {
      labelAr: "دول الخليج", labelEn: "Gulf States",     flag: "🇸🇦",
      value: major.salaryGCCAr || "—",
      note: ar ? "دولار أمريكي / شهرياً" : "USD / month",
      color: "from-emerald-500 to-teal-600",
    },
    {
      labelAr: "عالمياً",    labelEn: "International",    flag: "🌍",
      value: major.salaryIntlAr || "—",
      note: ar ? "يورو / شهرياً" : "EUR / month",
      color: "from-blue-500 to-indigo-600",
    },
  ];

  /* Filter courses to only show those that have resources in mockData */
  const activeFirstYearCourses = courses
    .filter(c => firstYearCourseIds.includes(c.id))
    .filter(c => resourcesByCourse[c.id] && resourcesByCourse[c.id].length > 0)
    .map(c => ({
      ...c,
      icon: courseIcons[c.id] || "BookOpen"
    }));

  return (
    <div
      className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
      dir={dir}
      style={{ fontFamily: ar ? "inherit" : "inherit" }}
    >
      {/* ══ HERO ══ */}
      <div className="relative w-full h-[52vh] min-h-[340px] max-h-[560px] overflow-hidden">
        {/* image */}
        <img
          src={major?.imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600";
          }}
        />
        {/* gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent dark:from-slate-950 dark:via-slate-950/30 dark:to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${major?.color} opacity-20 mix-blend-overlay`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.30)_100%)]" />

        {/* ── Back button top-right (RTL-safe) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute top-5 ltr:left-5 rtl:right-5 z-20"
        >
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl text-slate-900 dark:text-slate-100 font-bold text-sm hover:bg-white dark:hover:bg-white/10 transition-all"
          >
            <ArrowLeft className={`w-4 h-4 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
            <span>{t.common.back}</span>
          </button>
        </motion.div>

        {/* ── Hero text (bottom strip, no overlap with back btn) ── */}
        <div className="absolute bottom-0 inset-x-0 px-5 sm:px-8 pb-6 z-10">
          <motion.div {...fadeUp(0.1)}>
            {/* university badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/75 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/10 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-700 dark:text-white mb-3 shadow">
              <Sparkles className="w-3 h-3 text-primary dark:text-accent shrink-0" />
              {ar ? "جامعة البلقاء التطبيقية" : "BAU Faculty of Engineering"}
            </div>
            {/* icon + title row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${major.color} grid place-items-center border-2 border-white/30 shadow-2xl shrink-0`}>
                <Icon className="w-7 h-7 text-white" strokeWidth={1.7} />
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight drop-shadow-sm"
                style={{ lineHeight: 1.2 }}
              >
                {name}
              </h1>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-14">

        {/* ── About ── */}
        <motion.section {...fadeUp(0.15)}>
          <SectionHeader icon={<BookOpen className="w-5 h-5" />} label={ar ? "نظرة تفصيلية على التخصص" : "About the Major"} color={major.color} />
          <div className="mt-6 grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-[2rem] bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl p-8">
              <p
                className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium"
                style={{ lineHeight: 1.9 }}
              >
                {longDesc}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <QuickStat icon={<Award className="w-5 h-5" />}     label={ar ? "القسم" : "Department"}     value={name}                                  color={major.color} />
              <QuickStat icon={<Layers className="w-5 h-5" />}    label={ar ? "مدة الدراسة" : "Duration"}  value={ar ? "خمس سنوات" : "5 Years"}            color={major.color} />
              <QuickStat icon={<TrendingUp className="w-5 h-5" />} label={ar ? "الطلب في السوق" : "Market Demand"} value={ar ? "مرتفع جداً" : "Very High"} color={major.color} />
            </div>
          </div>
        </motion.section>

        {/* ── Degrees Offered — BADGES ── */}
        <motion.section {...fadeUp(0.2)}>
          <SectionHeader icon={<Award className="w-5 h-5" />} label={ar ? "الدرجات العلمية المتاحة" : "Degrees Offered"} color={major.color} />
          <div className={`mt-6 rounded-[2rem] bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl overflow-hidden`}>
            <div className={`h-1.5 bg-gradient-to-r ${major.color}`} />
            <div className="p-7">
              <div className="flex flex-wrap gap-3">
                {degreeBadges.map((deg, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-white/[0.06] border border-neutral-200 dark:border-white/10 shadow-sm"
                  >
                    <GraduationCap className="w-4 h-4 text-primary dark:text-accent shrink-0" />
                    <span
                      className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                      style={{ lineHeight: 1.6 }}
                    >
                      {deg}
                    </span>
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Career Paths — BADGES ── */}
        <motion.section {...fadeUp(0.25)}>
          <SectionHeader icon={<Briefcase className="w-5 h-5" />} label={ar ? "المسارات المهنية" : "Career Paths"} color={major.color} />
          <div className="mt-6 rounded-[2rem] bg-slate-900 border border-white/5 p-8 relative overflow-hidden">
            {/* blobs */}
            <div className={`absolute -top-16 -right-16 w-60 h-60 rounded-full bg-gradient-to-br ${major.color} opacity-15 blur-[70px]`} />
            <div className={`absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-br ${major.color} opacity-10 blur-[70px]`} />
            <div className="relative z-10 flex flex-wrap gap-3">
              {fieldBadges.map((field, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all cursor-default"
                >
                  <ChevronRight className={`w-3.5 h-3.5 text-white/50 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  <span
                    className="text-sm font-medium text-white/85"
                    style={{ lineHeight: 1.6 }}
                  >
                    {field}
                  </span>
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Global Salary Outlook — 3 CLEAN CARDS ── */}
        <motion.section {...fadeUp(0.3)}>
          <SectionHeader icon={<Banknote className="w-5 h-5" />} label={ar ? "التوقعات الراتبية العالمية" : "Global Salary Outlook"} color={major.color} />
          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            {salaryCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="rounded-[2rem] overflow-hidden bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl"
              >
                {/* coloured header */}
                <div className={`bg-gradient-to-br ${card.color} p-5 flex items-center gap-3`}>
                  <span className="text-3xl leading-none">{card.flag}</span>
                  <div>
                    <div className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                      {ar ? card.labelAr : card.labelEn}
                    </div>
                    <div className="text-white font-black text-base leading-tight mt-0.5">
                      {ar ? "الراتب الشهري" : "Monthly Range"}
                    </div>
                  </div>
                  <MapPin className="w-4 h-4 text-white/30 ltr:ml-auto rtl:mr-auto shrink-0" />
                </div>
                {/* value */}
                <div className="bg-white/40 dark:bg-slate-950/40 px-6 py-5">
                  <p
                    className="text-slate-900 dark:text-slate-100 font-black text-xl"
                    style={{ lineHeight: 1.4 }}
                  >
                    {card.value}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">
                    {card.note}
                  </p>
                  {/* progress bar */}
                  <div className="mt-4 h-1.5 rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${55 + i * 15}%` }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center">
            {ar ? "* أرقام تقديرية مبنية على بيانات سوق العمل لعام 2024-2025" : "* Estimated figures based on 2024-2025 labour market data"}
          </p>
        </motion.section>

        {/* ── First Year Courses ── */}
        <motion.section {...fadeUp(0.35)}>
          <SectionHeader icon={<BookMarked className="w-5 h-5" />} label={ar ? "مواد السنة الأولى" : "First Year Courses"} color={major.color} />
          <div className="mt-6 rounded-[2rem] overflow-hidden bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl">
            {/* dark intro bar */}
            <div className="bg-slate-900/90 dark:bg-white/5 px-7 py-5">
              <p
                className="text-white/80 dark:text-slate-400 text-sm font-medium max-w-2xl"
                style={{ lineHeight: 1.8 }}
              >
                {ar
                  ? "انقر على أي مادة للانتقال مباشرة إلى خزانة ملفاتها — امتحانات سابقة، ملخصات وكتب."
                  : "Click any course to jump straight to its resource vault — past papers, summaries and books included."}
              </p>
            </div>
            {/* course grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeFirstYearCourses.map((course, i) => {
                const CIcon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[course.icon] || BookOpen;
                const categoryId = courseCategoryMap[course.id] || "engineering";
                const categoryNames: Record<string, { en: string; ar: string }> = {
                  engineering: { en: "Engineering", ar: "هندسة وبرمجة" },
                  humanities: { en: "Humanities", ar: "متطلبات إنسانية" },
                  languages: { en: "Languages", ar: "لغات وتواصل" },
                  military_islamic: { en: "Military & Islamic", ar: "علوم عسكرية وإسلامية" },
                };
                const catName = ar ? categoryNames[categoryId]?.ar : categoryNames[categoryId]?.en;

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.04 + i * 0.04 }}
                  >
                    <div className="group relative">
                      <Link
                        to={`/materials/${course.id}`}
                        id={`course-link-${course.id}`}
                        className="flex flex-col p-5 rounded-3xl bg-white/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-primary/40 dark:hover:border-accent/40 hover:shadow-xl transition-all duration-300 h-full"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${major.color} grid place-items-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <CIcon className="w-6 h-6 text-white" strokeWidth={1.8} />
                          </div>
                          <div className="text-[10px] font-black font-mono px-2 py-1 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                            {course.code}
                          </div>
                        </div>
                        
                        <div className="space-y-1 mb-4">
                          <div className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-accent transition-colors line-clamp-1" style={{ lineHeight: 1.4 }}>
                            {ar ? course.nameAr : course.name}
                          </div>
                          <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {course.hours} {ar ? "ساعات" : "Hours"}
                          </div>
                        </div>

                        {/* Category link badge */}
                        <div className="mt-auto">
                          <Link
                            to={`/vault?category=${categoryId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 dark:bg-accent/5 border border-primary/10 dark:border-accent/10 text-[9px] font-black uppercase text-primary dark:text-accent hover:bg-primary/10 dark:hover:bg-accent/10 transition-colors"
                          >
                            <LayoutGrid className="w-3 h-3" />
                            {catName}
                          </Link>
                        </div>

                        {/* subtle highlight border on hover */}
                        <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/10 dark:group-hover:border-accent/5 pointer-events-none transition-colors`} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {/* year progress strip */}
            <div className="bg-white/40 dark:bg-white/5 px-7 py-4 border-t border-slate-200 dark:border-white/5 flex flex-wrap items-center gap-3">
              {["1", "2", "3", "4", "5"].map((yr, i) => (
                <div key={yr} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full text-xs font-black grid place-items-center border-2 ${i === 0 ? `bg-gradient-to-br ${major.color} text-white border-transparent` : "border-slate-200 dark:border-white/10 text-slate-400"}`}>
                    {yr}
                  </div>
                  {i < 4 && <div className="w-5 h-0.5 bg-slate-200 dark:bg-white/10" />}
                </div>
              ))}
              <span className="text-xs text-slate-400 ltr:ml-2 rtl:mr-2">
                {ar ? "السنة الأولى مُمثَّلة (5 سنوات)" : "Year 1 highlighted (5-year program)"}
              </span>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

/* ── Sub-components ── */
function SectionHeader({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} text-white grid place-items-center shadow-md shrink-0`}>
        {icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
        {label}
      </h2>
    </div>
  );
}

function QuickStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white grid place-items-center shadow-md shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</div>
      </div>
    </div>
  );
}
