/**
 * Majors.tsx — Stage 2: Premium Bento Grid
 * Clicking a card navigates to /major/:id
 */
import { m, type Variants } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { GraduationCap, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { majorsData } from "@/data/majorsData";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function getBentoClass(index: number): string {
  if (index === 0) return "md:col-span-8 md:row-span-2";
  if (index === 1) return "md:col-span-4 md:row-span-2";
  return "md:col-span-4 md:row-span-1";
}

export default function Majors() {
  const { lang, dir } = usePreferences();
  const navigate = useNavigate();
  const isAr = lang === "ar";

  return (
    <m.div
      dir={dir}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="min-h-screen pb-24 bg-background transition-colors duration-500"
    >

      <div className="relative z-10 px-4 md:px-8 pt-8">
        <PageHeader
          title={isAr ? "دليل التخصصات الهندسية" : "Engineering Majors Guide"}
          subtitle={isAr ? "اختر تخصصك واستعرض الخطة الدراسية والمسار المهني" : "Choose your major and explore the curriculum and career path"}
          icon={<GraduationCap className="h-6 w-6 text-cyan-400" />}
        />

        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 auto-rows-fr md:auto-rows-[220px] gap-2 md:gap-5 mt-4 md:mt-8 px-4 md:px-0"
        >
          {majorsData.map((major, i) => {
            const Icon =
              (LucideIcons as any)[major.icon] ||
              GraduationCap;

            return (
              <m.button
                key={major.id}
                variants={cardVariants}
                onClick={() => navigate(`/major/${major.id}`)}
                onMouseEnter={() => prefetchPage(PAGE_IMPORTS.MajorPage)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  getBentoClass(i),
                  "group relative p-0 rounded-xl md:rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm",
                  "bg-white dark:bg-slate-900 transition-all duration-500 text-start",
                  "hover:border-slate-300 dark:hover:border-white/15 hover:shadow-lg",
                  "flex flex-row md:flex-col h-20 md:h-auto"
                )}
              >
                {/* Background */}
                <div className="relative w-24 md:w-full h-full md:absolute md:inset-0 z-0 shrink-0">
                  <img
                    src={major.imageUrl}
                    alt={isAr ? major.nameAr : major.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center opacity-100 md:opacity-90 dark:md:opacity-60 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:from-slate-950 md:via-slate-900/40" />
                  <div className={cn("hidden md:block absolute inset-0 bg-gradient-to-br opacity-20 mix-blend-overlay", major.color)} />
                </div>

                {/* Accent glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 90%, ${major.accentColor}22 0%, transparent 70%)` }} />

                {/* Content */}
                <div className="relative z-10 flex-1 h-full p-3 md:p-5 flex flex-col items-start justify-center md:justify-end">
                  <div className="hidden md:inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl mb-3 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-5.5 h-5.5 text-white" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-[17px] md:text-2xl font-black text-slate-900 dark:text-white [data-theme=pink]:text-rose-950 dark:[data-theme=pink]:text-rose-100 mb-0.5 md:mb-1.5 tracking-tight leading-tight group-hover:text-accent transition-colors">
                    {isAr ? major.nameAr : major.name}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-xs leading-relaxed line-clamp-1 md:line-clamp-2 mb-0 md:mb-4 font-medium">
                    {isAr ? major.descriptionAr : major.description}
                  </p>

                  <div className="hidden md:flex items-center justify-between border-t border-slate-200 dark:border-white/8 pt-3 w-full">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase transition-all duration-300 group-hover:gap-2.5"
                      style={{ color: major.accentColor }}
                    >
                      {isAr ? "عرض التفاصيل" : "View Details"}
                      <ChevronRight className={cn("w-3.5 h-3.5", dir === "rtl" ? "rotate-180" : "")} />
                    </span>
                    {major.studyPlanUrl && (
                      <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">
                        {isAr ? "PDF متاح" : "PDF available"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:hidden pr-4 rtl:pl-4">
                  <ChevronRight className={cn("w-5 h-5 text-slate-300", dir === "rtl" ? "rotate-180" : "")} />
                </div>

                {/* Corner lines */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-slate-200 dark:border-white/10 rounded-tl-[2.5rem] group-hover:border-white/25 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-slate-200 dark:border-white/10 rounded-br-[2.5rem] group-hover:border-white/25 transition-colors duration-500" />
              </m.button>
            );
          })}
        </m.div>
      </div>
    </m.div>
  );
}
