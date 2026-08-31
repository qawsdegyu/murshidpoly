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

    if (!course) return null;

    return (
      <m.button
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        onMouseEnter={() => prefetchPage(PAGE_IMPORTS.VaultDetail)}
        className="group relative bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-start p-3 md:p-5 flex flex-col h-full overflow-hidden font-['Cairo'] min-h-[120px] shadow-sm hover:shadow-md transition-all"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), #0F172A, transparent 70%)` }}
        />

        <div className="relative z-10 flex items-start justify-between gap-2 md:gap-4 mb-2 md:mb-4 w-full">
          <div className="flex-1 min-w-0 pr-2">
            <div className="h-[2px] w-6 md:w-8 rounded-full mb-2 md:mb-3 bg-[#5EEAD4]" />
            <h3 className="text-sm md:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] leading-snug transition-all tracking-tight line-clamp-none md:line-clamp-2">
              {isAr ? (course?.nameAr || "مادة غير معرفة") : (course?.name || "Unknown Course")}
            </h3>
          </div>
          

        </div>

        <div className="mt-auto pt-2 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-col gap-2 relative z-10 w-full">
          <div className="flex items-center justify-between">
            {course?.instructors && course.instructors.length > 0 ? (
              <div className="flex flex-wrap gap-1 opacity-60 group-hover:opacity-100 transition-opacity w-full pr-4">
                <span className="text-[9px] font-bold text-[#64748B]">
                  {isAr ? "المدرسين:" : "Instructors:"}
                </span>
                <span className="text-[9px] font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">
                  {course.instructors.join(" • ")}
                </span>
              </div>
            ) : (
              <div />
            )}
            
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#F1F5F9] dark:bg-[#0F172A] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] transition-all duration-500 shrink-0">
              <ChevronRight className={cn("h-3 w-3 md:h-4 md:w-4", dir === "rtl" && "rotate-180")} />
            </div>
          </div>
        </div>
      </m.button>
    );
  }
));

CourseCard.displayName = "CourseCard";

export default CourseCard;
