import { memo, forwardRef } from "react";
import { m } from "framer-motion";
import { BookOpen, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/contexts/PreferencesContext";
import { type Course, resourcesByCourse } from "@/data/mockData";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  accentColor?: string;
  index?: number;
  icon?: React.ReactNode;
}

const CourseCard = memo(forwardRef<HTMLButtonElement, CourseCardProps>(
  ({ course, onClick, accentColor = "#00ffff", index = 0, icon }, ref) => {
    const { lang, dir } = usePreferences();
    const isAr = lang === "ar";
    const hasResources = !!(course?.id && resourcesByCourse[course.id]?.length);

    if (!course) return null;

    return (
      <m.button
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ 
          y: -10, 
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" } 
        }}
        whileTap={{ scale: 0.98 }}
        style={{ willChange: "transform, opacity" }}
        onClick={onClick}
        onMouseEnter={() => prefetchPage(PAGE_IMPORTS.CoursePage)}
        className="group relative text-start p-6 md:p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl hover:shadow-[0_20px_50px_rgba(0,255,255,0.1)] hover:border-accent/40 hover:bg-slate-900/60 transition-all duration-500 overflow-hidden flex flex-col h-full isolation-isolate"
      >
        {/* Animated Background Gradient */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-accent via-transparent to-transparent"
        />

        {/* Accent Glow Point */}
        <div 
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-all duration-700 pointer-events-none"
          style={{ background: accentColor }} 
        />
        
        <div className="flex items-start justify-between gap-4 relative z-10 mb-6 pointer-events-none">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase text-accent/60 mb-2 font-mono drop-shadow-sm">
              {course?.code || "COURSE"}
            </div>
            <h3 className="text-lg md:text-xl font-black text-white leading-tight group-hover:text-accent transition-colors break-words font-['Cairo'] tracking-tight">
              {isAr ? (course?.nameAr || "مادة غير معرفة") : (course?.name || "Unknown Course")}
            </h3>
          </div>
          <div 
            className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner group-hover:border-accent/50 group-hover:scale-110 transition-all duration-500"
            style={{ background: `${accentColor}15`, color: accentColor }}
          >
            {icon || <BookOpen className="h-5 w-5 md:h-6 md:w-6" />}
          </div>
        </div>

        <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between relative z-10 pointer-events-none">
          <div className="flex items-center gap-3">
            {hasResources ? (
              <span
                className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-black px-3 py-1 rounded-lg shadow-sm"
                style={{ background: `${accentColor}20`, color: accentColor }}
              >
                <FileText className="h-3 w-3 md:h-3.5 md:w-3.5" />
                {isAr ? "ملفات متاحة" : "Resources"}
              </span>
            ) : (
              <span className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-widest">
                {isAr ? "قريباً" : "Soon"}
              </span>
            )}
            <span className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-[0.1em]">
              {course?.hours || 0} {isAr ? "ساعات" : "hrs"}
            </span>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all duration-500">
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-all",
                dir === "rtl" ? "rotate-180" : ""
              )}
            />
          </div>
        </div>
      </m.button>
    );
  }
));

CourseCard.displayName = "CourseCard";

export default CourseCard;
