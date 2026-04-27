/**
 * Majors.tsx — Stage 2: Premium Bento Grid
 * Clicking a card navigates to /major/:id
 */
import { motion, type Variants } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { GraduationCap, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { majorsData } from "@/data/majorsData";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
};

function getBentoClass(index: number): string {
  if (index === 0) return "md:col-span-8 row-span-2";
  if (index === 1) return "md:col-span-4 row-span-2";
  return "md:col-span-4 row-span-1";
}

export default function Majors() {
  const { lang, dir } = usePreferences();
  const navigate = useNavigate();
  const isAr = lang === "ar";

  return (
    <div dir={dir} className="min-h-screen pb-24 bg-[#020617] selection:bg-cyan-500/30">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,0.06)_0%,transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      <div className="relative z-10 px-4 md:px-8 pt-8">
        <PageHeader
          title={isAr ? "دليل التخصصات الهندسية" : "Engineering Majors Guide"}
          subtitle={isAr ? "اختر تخصصك واستعرض الخطة الدراسية والمسار المهني" : "Choose your major and explore the curriculum and career path"}
          icon={<GraduationCap className="h-6 w-6 text-cyan-400" />}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 md:grid-cols-12 auto-rows-[260px] gap-4 mt-10"
        >
          {majorsData.map((major, i) => {
            const Icon =
              (LucideIcons as any)[major.icon] ||
              GraduationCap;

            return (
              <motion.button
                key={major.id}
                variants={cardVariants}
                onClick={() => navigate(`/major/${major.id}`)}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  getBentoClass(i),
                  "col-span-4 group relative rounded-[2.5rem] overflow-hidden border border-white/5",
                  "bg-neutral-950 shadow-2xl transition-shadow duration-500 text-start",
                  "hover:border-white/15 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]"
                )}
              >
                {/* Background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={major.imageUrl}
                    alt={isAr ? major.nameAr : major.name}
                    className="w-full h-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20 mix-blend-overlay", major.color)} />
                </div>

                {/* Accent glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 90%, ${major.accentColor}22 0%, transparent 70%)` }} />

                {/* Content */}
                <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-end min-h-[240px]">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl mb-5 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight leading-tight">
                    {isAr ? major.nameAr : major.name}
                  </h3>

                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 mb-5 font-medium group-hover:text-neutral-200 transition-colors duration-300">
                    {isAr ? major.descriptionAr : major.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-white/8 pt-4">
                    <span
                      className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-all duration-300 group-hover:gap-3"
                      style={{ color: major.accentColor }}
                    >
                      {isAr ? "عرض التفاصيل" : "View Details"}
                      <ChevronRight className={cn("w-4 h-4", dir === "rtl" ? "rotate-180" : "")} />
                    </span>
                    {major.studyPlanUrl && (
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                        {isAr ? "PDF متاح" : "PDF available"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Corner lines */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white/10 rounded-tl-[2.5rem] group-hover:border-white/25 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white/10 rounded-br-[2.5rem] group-hover:border-white/25 transition-colors duration-500" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
