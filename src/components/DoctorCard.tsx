import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Copy, ExternalLink, GraduationCap, BookOpen, Briefcase, MapPin } from "lucide-react";
import { type FacultyMember } from "@/data/facultyData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  faculty: FacultyMember;
  index: number;
  lang: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onCopy: (email: string) => void;
}

const DoctorCard = memo(function DoctorCard({ faculty: f, index: i, lang, isExpanded, onToggle, onCopy }: DoctorCardProps) {
  const navigate = useNavigate();
  const initials = useMemo(() => f.name
    .split(" ")
    .filter(n => n.length > 2)
    .slice(0, 2)
    .map(n => n[0])
    .join(""), [f.name]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden bg-card/40 border border-border/60 backdrop-blur-2xl rounded-2xl transition-all duration-500 h-fit shadow-md hover:shadow-2xl",
        isExpanded ? "ring-2 ring-accent/30 shadow-2xl" : "hover:border-accent/30 hover:bg-card/60"
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
            <h3 className="font-black text-xl text-foreground group-hover:text-accent transition-colors leading-tight">
              {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
              {f.rank && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-accent/10 text-accent uppercase tracking-wider">
                  {f.rank}
                </span>
              )}
              {f.buildingId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campus-map?id=${f.buildingId}`);
                  }}
                  className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-wider border border-primary/20 navy-pop"
                >
                  <MapPin className="h-3 w-3" />
                  {lang === "ar" ? `مبنى ${f.buildingId}` : `Bldg ${f.buildingId}`}
                </button>
              )}
              {f.email && (
                <div className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-[#4B53BC]/10 text-[#4B53BC] uppercase tracking-wider border border-[#4B53BC]/20 navy-pop">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                    <path d="M12.5 13.5C12.5 14.88 11.38 16 10 16C8.62 16 7.5 14.88 7.5 13.5C7.5 12.12 8.62 11 10 11C11.38 11 12.5 12.12 12.5 13.5ZM17 12V16.5C17 17.33 16.33 18 15.5 18H12.75L10 21V18H10C7.79 18 6 16.21 6 14C6 11.79 7.79 10 10 10H15.5C16.33 10 17 10.67 17 11.5V12ZM21 8.5C21 9.33 20.33 10 19.5 10H19V11.5C19 12.08 18.78 12.61 18.42 13C18.79 13 19 13.47 19 14V14.5C19 15.33 18.33 16 17.5 16H17V11.5C17 10.12 15.88 9 14.5 9H10C10 7.34 11.34 6 13 6H19.5C20.33 6 21 6.67 21 7.5V8.5Z" />
                  </svg>
                  Teams
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-bold">
                  {f.department}
                </p>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-muted-foreground group-hover:text-accent transition-colors shrink-0"
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
              <div className="bg-surface rounded-xl p-4 border border-border/50 space-y-3 shadow-inner">
                {/* Subjects */}
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="h-4 w-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground">
                      {lang === "ar" ? "المواد" : "Subjects"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 italic">
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
                    <p className="text-sm font-black text-foreground">
                      {lang === "ar" ? "الساعات المكتبية" : "Office Hours"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 italic">
                      {lang === "ar" ? "سيتم إضافتها قريباً..." : "Coming soon..."}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                {f.email && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 mt-2 space-y-3">
                    <div className="flex flex-col gap-2 md:gap-3">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopy(f.email);
                          }}
                          className="flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-card border border-border hover:border-accent/30 transition-all text-[13px] md:text-[15px] font-semibold text-muted-foreground group/btn overflow-hidden"
                        >
                          <Mail className="h-4 w-4 md:h-5 md:w-5 text-accent shrink-0" />
                          <span className="break-all">{f.email}</span>
                          <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 opacity-30 group-hover/btn:opacity-100 transition-opacity shrink-0 ltr:ml-auto rtl:mr-auto" />
                        </motion.button>
                        <motion.a
                          whileTap={{ scale: 0.97 }}
                          href={`mailto:${f.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="h-[42px] w-[42px] md:h-[48px] md:w-[48px] rounded-lg md:rounded-xl bg-accent flex items-center justify-center text-white shadow-md shadow-accent/20 shrink-0 hover:shadow-accent/40 transition-shadow"
                          aria-label="Send Email"
                        >
                          <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
                        </motion.a>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopy(f.email.split('@')[0]);
                          }}
                          className="flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-card border border-[#4B53BC]/30 hover:border-[#4B53BC]/60 transition-all text-[13px] md:text-[15px] font-semibold text-muted-foreground group/btn-teams overflow-hidden"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5 text-[#4B53BC] shrink-0 fill-current">
                            <path d="M12.5 13.5C12.5 14.88 11.38 16 10 16C8.62 16 7.5 14.88 7.5 13.5C7.5 12.12 8.62 11 10 11C11.38 11 12.5 12.12 12.5 13.5ZM17 12V16.5C17 17.33 16.33 18 15.5 18H12.75L10 21V18H10C7.79 18 6 16.21 6 14C6 11.79 7.79 10 10 10H15.5C16.33 10 17 10.67 17 11.5V12ZM21 8.5C21 9.33 20.33 10 19.5 10H19V11.5C19 12.08 18.78 12.61 18.42 13C18.79 13 19 13.47 19 14V14.5C19 15.33 18.33 16 17.5 16H17V11.5C17 10.12 15.88 9 14.5 9H10C10 7.34 11.34 6 13 6H19.5C20.33 6 21 6.67 21 7.5V8.5Z" />
                          </svg>
                          <span className="break-all font-bold text-[#4B53BC]">{f.email.split('@')[0]}</span>
                          <span className="text-[11px] md:text-[13px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-md bg-[#4B53BC]/10 text-[#4B53BC] uppercase tracking-wider mx-1">Teams</span>
                          <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 opacity-30 group-hover/btn-teams:opacity-100 transition-opacity shrink-0 ltr:ml-auto rtl:mr-auto" />
                        </motion.button>
                      </div>

                      {f.profileUrl && (
                        <div className="flex items-center gap-2">
                          <motion.a
                            whileTap={{ scale: 0.97 }}
                            href={f.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-[13px] md:text-[15px] font-bold text-primary group/profile shadow-sm"
                          >
                            <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
                            <span>{lang === "ar" ? "الملف الأكاديمي (الموقع الرسمي)" : "Academic Profile (Official)"}</span>
                          </motion.a>
                        </div>
                      )}
                    </div>

                    {/* Teams Tip */}
                    <div className="bg-[#4B53BC]/10 dark:bg-[#4B53BC]/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-[#4B53BC]/30 flex gap-4 md:gap-5 rtl:text-right shadow-lg shadow-[#4B53BC]/5 mt-1 md:mt-2" dir="rtl">
                      <div className="shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#4B53BC]/20 flex items-center justify-center backdrop-blur-sm border border-[#4B53BC]/30">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 text-[#4B53BC] fill-current">
                          <path d="M12.5 13.5C12.5 14.88 11.38 16 10 16C8.62 16 7.5 14.88 7.5 13.5C7.5 12.12 8.62 11 10 11C11.38 11 12.5 12.12 12.5 13.5ZM17 12V16.5C17 17.33 16.33 18 15.5 18H12.75L10 21V18H10C7.79 18 6 16.21 6 14C6 11.79 7.79 10 10 10H15.5C16.33 10 17 10.67 17 11.5V12ZM21 8.5C21 9.33 20.33 10 19.5 10H19V11.5C19 12.08 18.78 12.61 18.42 13C18.79 13 19 13.47 19 14V14.5C19 15.33 18.33 16 17.5 16H17V11.5C17 10.12 15.88 9 14.5 9H10C10 7.34 11.34 6 13 6H19.5C20.33 6 21 6.67 21 7.5V8.5Z" />
                        </svg>
                      </div>
                      <div className="flex flex-col gap-1.5 md:gap-2.5 justify-center">
                        <p className="text-[14px] md:text-[17px] font-black text-foreground leading-tight">
                          ملاحظة: حساب التيمز (Teams) هو نفس البريد الجامعي للدكتور ({f.email.split('@')[0]}).
                        </p>
                        <p className="text-[12px] md:text-[14.5px] text-muted-foreground font-bold leading-relaxed opacity-90">
                          يمكنك التواصل عبر Teams باستخدام اليوزر (Username) الخاص بالجيميل بدون @bau.edu.jo
                        </p>
                      </div>
                    </div>
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
