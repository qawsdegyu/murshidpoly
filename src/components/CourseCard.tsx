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
  ({ course, onClick, accentColor = "#3b82f6", index = 0, icon }, ref) => {
    const { lang, dir } = usePreferences();
    const isAr = lang === "ar";
    const hasResources = !!(course?.id && resourcesByCourse[course.id]?.length);

    // Return null or placeholder if course is missing (though filtered upstream)
    if (!course) return null;

    return (
      <m.button
        ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        style={{ willChange: "transform, opacity" }}
        onClick={onClick}
        onMouseEnter={() => prefetchPage(PAGE_IMPORTS.CoursePage)}
        className="group relative text-start p-4 md:p-6 rounded-xl bg-card/40 border border-border shadow-sm hover:shadow-2xl hover:border-accent/30 hover:bg-card/60 transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full isolation-isolate"
      >

        {/* Accent Glow */}
        <div 
          className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{ background: accentColor }} 
        />
        
        <div className="flex items-start justify-between gap-2.5 relative z-10 mb-3 pointer-events-none">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-1 font-mono">
              {course?.code || "COURSE-ID"}
            </div>
            <h3 className="text-[15px] md:text-base font-black text-foreground leading-[1.2] group-hover:text-accent transition-colors break-words">
              {isAr ? (course?.nameAr || "مادة غير معرفة") : (course?.name || "Unknown Course")}
            </h3>
          </div>
          <div 
            className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-border/50"
            style={{ background: `${accentColor}15`, color: accentColor }}
          >
            {icon || <BookOpen className="h-4 w-4" />}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between relative z-10 pointer-events-none">
          <div className="flex items-center gap-1.5">
            {hasResources ? (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md"
                style={{ background: `${accentColor}22`, color: accentColor }}
              >
                <FileText className="h-2.5 w-2.5" />
                {isAr ? "ملفات متاحة" : "Resources"}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground font-black">
                {isAr ? "قريباً" : "Coming soon"}
              </span>
            )}
            <span className="text-[11px] text-muted-foreground font-black uppercase tracking-wider">
              {course?.hours || 0} {isAr ? "ساعات" : "hrs"}
            </span>
          </div>
          
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground group-hover:text-accent transition-all",
              dir === "rtl" ? "rotate-180" : "",
              "group-hover:translate-x-0.5"
            )}
          />
        </div>
      </m.button>
    );
  }
));

CourseCard.displayName = "CourseCard";

export default CourseCard;

