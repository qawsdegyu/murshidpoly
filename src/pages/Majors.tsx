/**
 * Majors.tsx — Stage 2: Premium Bento Grid
 * Clicking a card navigates to /major/:id
 */
import React from "react";
import { m, type Variants } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { GraduationCap, ChevronRight, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { isUserAdmin } from "@/lib/admin";
import { majorsData } from "@/data/majorsData";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function getBentoClass(index: number): string {
  return "w-full";
}

// Separate MajorCard component with forwardRef to fix Framer Motion warnings
const MajorCard = React.forwardRef<HTMLDivElement, {
  major: any;
  i: number;
  isAr: boolean;
  isAdmin: boolean;
  navigate: any;
  dir: string;
}>(({ major, i, isAr, isAdmin, navigate, dir }, ref) => {
  const Icon = (LucideIcons as any)[major.icon] || GraduationCap;
  const bentoClass = getBentoClass(i);

  return (
    <m.div
      ref={ref}
      variants={cardVariants}
      className={cn("relative group overflow-hidden rounded-2xl md:rounded-[2.5rem]", bentoClass)}
    >
      <m.div
        onClick={() => navigate(`/major/${major.id}`)}
        onMouseEnter={() => prefetchPage(PAGE_IMPORTS.MajorPage)}
        className={cn(
          "w-full h-full p-0 flex flex-col md:flex-row overflow-hidden border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#1E293B] cursor-pointer",
          "hover:border-[#CBD5E1] dark:hover:border-[#64748B] hover:shadow-md transition-all duration-700 border"
        )}
      >
        {/* UNIFIED HORIZONTAL LAYOUT */}
        <div className={cn("flex w-full h-[115px] md:h-[260px] relative overflow-hidden", dir === 'rtl' ? 'flex-row-reverse' : 'flex-row')}>
          {/* Image Area */}
          <div className="relative w-[35%] md:w-[40%] h-full overflow-hidden shrink-0">
            <img
              src={major.imageUrl}
              alt={major.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Gradient fading into the content area */}
            <div className={cn(
              "absolute inset-0",
              dir === 'rtl' 
                ? "bg-gradient-to-l from-transparent via-[#F8FAFC]/20 dark:via-[#1E293B]/20 to-[#F8FAFC] dark:to-[#1E293B]" 
                : "bg-gradient-to-r from-transparent via-[#F8FAFC]/20 dark:via-[#1E293B]/20 to-[#F8FAFC] dark:to-[#1E293B]"
            )} />
            <div className="absolute inset-0 opacity-10 mix-blend-overlay transition-opacity group-hover:opacity-20 bg-black" />
          </div>

          {/* Content Area */}
          <div className="flex-1 h-full p-3 md:p-8 flex flex-col justify-between text-start relative bg-[#F8FAFC] dark:bg-[#1E293B] md:bg-transparent md:dark:bg-transparent z-10">
            <div className="space-y-1.5 md:space-y-4">
              <div className="flex items-center gap-2.5 mb-1 md:mb-3">
                <div className={cn(
                  "inline-flex items-center justify-center rounded-lg md:rounded-2xl transition-all duration-700",
                  "w-7 h-7 md:w-14 md:h-14 bg-[#E8FCF9] dark:bg-[#0F172A] text-[#14B8A6] dark:text-[#14B8A6]"
                )}>
                  <Icon className="w-3.5 h-3.5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-xs md:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] leading-tight line-clamp-2 md:line-clamp-none">
                  {isAr ? major.nameAr : major.name}
                </h3>
              </div>
              <p className="text-[9px] md:text-sm text-[#64748B] dark:text-[#94A3B8] line-clamp-3 md:line-clamp-4 leading-relaxed font-bold max-w-2xl">
                {isAr ? major.descriptionAr : major.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 md:pt-6 border-t border-[#F1F5F9] dark:border-[#334155] mt-auto">
              <div className="flex items-center gap-1.5 md:gap-4 group/explore">
                <span className={cn(
                  "text-[9px] md:text-sm font-black uppercase tracking-widest text-[#2563EB] group-hover:text-[#14B8A6] transition-colors"
                )}>
                  {isAr ? "استكشف التخصص" : "Explore Major"}
                </span>
                <ChevronRight className={cn(
                  "w-3 h-3 md:w-5 md:h-5 transition-all text-[#2563EB] group-hover:text-[#14B8A6] group-active:translate-x-1 group-hover:translate-x-1",
                  dir === "rtl" ? "rotate-180 group-active:-translate-x-1 group-hover:-translate-x-1" : ""
                )} />
              </div>

              <div className={cn(
                "w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-colors duration-500 bg-[#CBD5E1] dark:bg-[#334155] group-hover:bg-[#14B8A6] dark:group-hover:bg-[#14B8A6]"
              )} />
            </div>
          </div>
        </div>
      </m.div>
    </m.div>
  );
});

MajorCard.displayName = "MajorCard";

export default function Majors() {
  const { lang, dir } = usePreferences();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const isAdmin = isUserAdmin(user?.email);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <m.div
      dir={dir}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-32 bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-[#F8FAFC] dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A] overflow-x-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 pt-16 md:pt-24">
        <PageHeader
          title={isAr ? "دليل التخصصات الهندسية" : "Engineering Majors Guide"}
          subtitle={isAr ? "اكتشف خريطة طريقك الأكاديمية مع مرشد في كلية الهندسة" : "Explore your academic roadmaps with Murshid at FET"}
          icon={<GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-primary animate-pulse" />}
          className="mb-6 md:mb-10 text-xl md:text-section-title"
        />

        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 md:gap-6 mt-2 md:mt-6"
        >
          {majorsData.map((major, i) => (
            <MajorCard
              key={major.id}
              major={major}
              i={i}
              isAr={isAr}
              isAdmin={isAdmin}
              navigate={navigate}
              dir={dir}
            />
          ))}
        </m.div>
      </div>
    </m.div>
  );
}
