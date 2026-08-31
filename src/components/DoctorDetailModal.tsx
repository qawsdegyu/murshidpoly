import { useEffect, forwardRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Copy, ExternalLink, BookOpen, Briefcase, MapPin, GraduationCap, User } from "lucide-react";
import { type FacultyMember } from "@/data/facultyData";
import { useNavigate } from "react-router-dom";

interface DoctorDetailModalProps {
  faculty: FacultyMember;
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  onCopy: (email: string) => void;
}

const DoctorDetailModal = forwardRef<HTMLDivElement, DoctorDetailModalProps>(({
  faculty: f,
  isOpen,
  onClose,
  lang,
  onCopy
}, ref) => {
  const navigate = useNavigate();

  // Scroll Lock Implementation
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [isOpen]);

  const initials = useMemo(() => f.name
    .split(" ")
    .filter(n => n.length > 2)
    .slice(0, 2)
    .map(n => n[0])
    .join(""), [f.name]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div 
      ref={ref} 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xl max-h-[92dvh] bg-white dark:bg-neutral-950 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-10 overscroll-contain"
      >
        {/* Header Section */}
        <div className="relative shrink-0 p-5 sm:p-6 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-b border-border/50">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 rtl:left-4 rtl:right-auto w-10 h-10 rounded-xl bg-white/50 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/60 backdrop-blur-xl text-foreground flex items-center justify-center transition-all border border-border/50 z-10 shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-2 sm:mt-0 text-center sm:text-start">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-lg">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2 leading-tight">
                {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
              </h2>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                {f.rank && (
                  <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded bg-accent/10 text-accent uppercase tracking-wider">
                    {f.rank}
                  </span>
                )}
                {f.buildingId && (
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/campus-map?id=${f.buildingId}`);
                    }}
                    className="flex items-center gap-1 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-wider border border-primary/20"
                  >
                    <MapPin className="h-3 w-3" />
                    {lang === "ar" ? `مبنى ${f.buildingId}` : `Bldg ${f.buildingId}`}
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground font-bold text-sm">
                <GraduationCap className="h-4 w-4" />
                <span className="truncate">{f.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-surface/30">
          
          <div className="flex flex-col gap-4">
            {/* Subjects */}
            <div className="bg-white dark:bg-white/[0.02] border border-border/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-foreground leading-none">
                  {lang === "ar" ? "المواد" : "Subjects"}
                </h3>
              </div>
              <div className="ltr:ml-13 rtl:mr-13 flex flex-wrap gap-2">
                {f.subjects ? (
                  f.subjects.split(/،|,/).map((subject, idx) => (
                    <span key={idx} className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                      {subject.trim()}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground font-semibold italic">
                    {lang === "ar" ? "لا يوجد مواد مسجلة حالياً" : "No subjects currently registered"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          {f.email && (
            <div className="space-y-5">
              <h3 className="text-xl font-black text-foreground mb-5 leading-relaxed">
                {lang === "ar" ? "معلومات التواصل" : "Contact Information"}
              </h3>
              
              <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onCopy(f.email)}
                      className="flex-1 flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3.5 sm:py-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-border/50 hover:border-accent/40 transition-all text-xs sm:text-[17px] font-bold text-foreground group shadow-sm hover:shadow-md overflow-hidden"
                    >
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-accent shrink-0" />
                      <span className="truncate text-start leading-relaxed flex-1 min-w-0">{f.email}</span>
                      <Copy className="h-4.5 w-4.5 sm:h-5 sm:w-5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ltr:ml-auto rtl:mr-auto" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCopy(f.email.split('@')[0])}
                    className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3.5 sm:py-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-[#4B53BC]/30 hover:border-[#4B53BC]/60 transition-all text-xs sm:text-[17px] font-bold text-foreground group shadow-sm hover:shadow-md overflow-hidden"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 text-[#4B53BC] shrink-0 fill-current">
                      <path d="M12.5 13.5C12.5 14.88 11.38 16 10 16C8.62 16 7.5 14.88 7.5 13.5C7.5 12.12 8.62 11 10 11C11.38 11 12.5 12.12 12.5 13.5ZM17 12V16.5C17 17.33 16.33 18 15.5 18H12.75L10 21V18H10C7.79 18 6 16.21 6 14C6 11.79 7.79 10 10 10H15.5C16.33 10 17 10.67 17 11.5V12ZM21 8.5C21 9.33 20.33 10 19.5 10H19V11.5C19 12.08 18.78 12.61 18.42 13C18.79 13 19 13.47 19 14V14.5C19 15.33 18.33 16 17.5 16H17V11.5C17 10.12 15.88 9 14.5 9H10C10 7.34 11.34 6 13 6H19.5C20.33 6 21 6.67 21 7.5V8.5Z" />
                    </svg>
                    <span className="truncate font-black text-[#4B53BC] leading-relaxed text-start flex-1 min-w-0">{f.email.split('@')[0]}</span>
                    <span className="text-[10px] sm:text-[13px] font-black px-2 py-1 rounded bg-[#4B53BC]/10 text-[#4B53BC] uppercase tracking-wider shrink-0 ltr:mr-2 rtl:ml-2">Teams</span>
                    <Copy className="h-4.5 w-4.5 sm:h-5 sm:w-5 opacity-40 group-hover:opacity-100 transition-opacity shrink-0 ltr:ml-auto rtl:mr-auto" />
                  </motion.button>

                {f.profileUrl && (
                  <motion.a
                    whileTap={{ scale: 0.98 }}
                    href={f.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-sm sm:text-base font-bold text-primary shadow-sm mt-1"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>{lang === "ar" ? "الملف الأكاديمي (الموقع الرسمي)" : "Academic Profile (Official)"}</span>
                  </motion.a>
                )}
              </div>


            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
});

export default DoctorDetailModal;
