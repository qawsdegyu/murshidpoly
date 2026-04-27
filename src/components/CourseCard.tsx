import { motion } from "framer-motion";
import { BookOpen, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/contexts/PreferencesContext";
import { type Course, resourcesByCourse } from "@/data/mockData";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  accentColor?: string;
  index?: number;
}

export default function CourseCard({ course, onClick, accentColor = "#3b82f6", index = 0 }: CourseCardProps) {
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";
  const hasResources = !!(resourcesByCourse[course.id]?.length);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative text-start p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Accent Glow */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: accentColor }} 
      />
      
      <div className="flex items-start justify-between gap-3 relative z-10 mb-4">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-black tracking-widest uppercase text-slate-600 mb-1.5 font-mono">
            {course.code}
          </div>
          <h3 className="text-sm font-bold text-slate-200 leading-snug group-hover:text-white transition-colors line-clamp-2">
            {isAr ? course.nameAr : course.name}
          </h3>
        </div>
        <div 
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.05]"
          style={{ background: `${accentColor}15`, color: accentColor }}
        >
          <BookOpen className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {hasResources ? (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg"
              style={{ background: `${accentColor}22`, color: accentColor }}
            >
              <FileText className="h-2.5 w-2.5" />
              {isAr ? "ملفات متاحة" : "Resources"}
            </span>
          ) : (
            <span className="text-[10px] text-slate-700 font-black">
              {isAr ? "قريباً" : "Coming soon"}
            </span>
          )}
          <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">
            {course.hours} {isAr ? "ساعات" : "hrs"}
          </span>
        </div>
        
        <ChevronRight
          className={cn(
            "h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-all",
            dir === "rtl" ? "rotate-180" : "",
            "group-hover:translate-x-0.5"
          )}
        />
      </div>
    </motion.button>
  );
}
