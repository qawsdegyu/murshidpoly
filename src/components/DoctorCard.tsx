import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Copy, ExternalLink, GraduationCap, BookOpen, Briefcase } from "lucide-react";
import { type FacultyMember } from "@/data/facultyData";
import { cn } from "@/lib/utils";

interface DoctorCardProps {
  faculty: FacultyMember;
  index: number;
  lang: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onCopy: (email: string) => void;
}

const DoctorCard = memo(function DoctorCard({ faculty: f, index: i, lang, isExpanded, onToggle, onCopy }: DoctorCardProps) {
  const initials = f.name
    .split(" ")
    .filter(n => n.length > 2)
    .slice(0, 2)
    .map(n => n[0])
    .join("");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.01, duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden bg-surface/40 dark:bg-surface/5 border border-border/60 dark:border-white/10 backdrop-blur-2xl rounded-2xl transition-all duration-500 h-fit shadow-md hover:shadow-2xl",
        isExpanded ? "ring-2 ring-accent/30 shadow-2xl" : "hover:border-accent/30 hover:bg-surface/60"
      )}

    >
      <div 
        onClick={() => onToggle(f.id)}
        className="p-6 cursor-pointer"
      >
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-accent/20 flex items-center justify-center text-accent font-black text-3xl shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            {initials || "د"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-xl text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors leading-tight">
              {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <GraduationCap className="h-4 w-4 text-accent/70" />
              <p className="text-base text-slate-500 dark:text-slate-400 font-bold">
                {f.department}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-slate-400 group-hover:text-accent transition-colors shrink-0"
          >
            <Search className="h-5 w-5" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200/50 dark:border-white/5 space-y-3 shadow-inner">
                {/* Subjects */}
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="h-4 w-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                      {lang === "ar" ? "المواد" : "Subjects"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">
                      {lang === "ar" ? "سيتم إضافتها قريباً..." : "Coming soon..."}
                    </p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase className="h-4 w-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                      {lang === "ar" ? "الساعات المكتبية" : "Office Hours"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">
                      {lang === "ar" ? "سيتم إضافتها قريباً..." : "Coming soon..."}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                {f.email && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-white/10 mt-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopy(f.email);
                      }}
                      className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-accent/30 transition-all text-xs text-slate-600 dark:text-slate-300 group/btn overflow-hidden"
                    >
                      <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="break-all">{f.email}</span>
                      <Copy className="h-3 w-3 opacity-30 group-hover/btn:opacity-100 transition-opacity shrink-0 ltr:ml-auto rtl:mr-auto" />
                    </motion.button>
                    <motion.a
                      whileTap={{ scale: 0.97 }}
                      href={`mailto:${f.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center text-white shadow-md shadow-accent/20 shrink-0 hover:shadow-accent/40 transition-shadow"
                      aria-label="Send Email"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </motion.a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-40 group-hover:animate-shine pointer-events-none" />
      )}
    </motion.article>
  );
});

export default DoctorCard;
