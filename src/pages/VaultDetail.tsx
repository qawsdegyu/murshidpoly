import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, FileText, BookMarked, FileCheck, Brain, Download, User,
  GraduationCap, Mail, Phone, Copy, MapPin, Eye, Youtube, MessageCircle,
  Share2, Upload, Play, Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  courses, resourcesByCourse, instructorsByCourse, faculty, Resource,
} from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import MaterialList from "@/components/MaterialList";
import { facultyList, FacultyMember } from "@/data/facultyData";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function InstructorCards({ department, courseName }: { department: string; courseName: string }) {
  const { t, lang, dir } = usePreferences();
  const [search, setSearch] = useState("");

  const getMappedDepartments = (courseDept: string): string[] => {
    const dept = courseDept.toLowerCase();
    if (dept.includes("general") || dept.includes("basic science")) {
      return ["قسم العلوم الاساسية العلمية", "قسم العلوم الانسانية", "قسم العلوم الاساسية الانسانية"];
    }
    if (dept.includes("computer")) return ["قسم هندسة الحاسوب", "قسم الهندسة الكهربائية"];
    if (dept.includes("electrical")) return ["قسم الهندسة الكهربائية"];
    if (dept.includes("mechanical")) return ["قسم الهندسة الميكانيكية", "قسم هندسة الميكاترونكس"];
    if (dept.includes("civil")) return ["قسم الهندسة المدنية"];
    if (dept.includes("chemical")) return ["قسم الهندسة الكيميائية"];
    if (dept.includes("industrial")) return ["قسم الهندسة الميكانيكية"];
    if (dept.includes("mechatronics")) return ["قسم هندسة الميكاترونكس", "قسم الهندسة الميكانيكية"];
    return ["كلية الهندسة التكنولوجية"];
  };

  const targetDepts = getMappedDepartments(department);
  const filteredList = facultyList.filter(f => {
    const matchesDept = targetDepts.some(d => f.department.includes(d) || d.includes(f.department));
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                         f.department.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const copy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(lang === "ar" ? "تم نسخ البريد الإلكتروني" : "Email copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="relative group">
        <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          placeholder={lang === "ar" ? "ابحث عن مدرس..." : "Search for an instructor..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-surface/50 border border-border backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
        />
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-12 bg-surface/30 rounded-3xl border border-dashed border-border">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm font-medium">
            {lang === "ar" ? "لا يوجد بيانات تواصل حالياً لهذا الاسم" : "No contact information available for this name"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList?.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden bg-surface/40 border border-border/60 backdrop-blur-2xl rounded-2xl p-5 hover:border-accent/30 hover:bg-surface/60 transition-all duration-300 isolation-isolate"
            >
              <div className="flex items-start justify-between gap-4 pointer-events-none">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-accent/20 flex items-center justify-center text-accent font-black text-lg shrink-0 shadow-lg">
                    {f.name.split(" ").filter(n => n.length > 2)[0]?.[0] || "د"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground group-hover:text-accent transition-colors truncate">
                      {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                      {f.department}
                    </p>
                  </div>
                </div>

                {f.email && (
                  <div className="flex gap-1.5 shrink-0 pointer-events-auto">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copy(f.email)}
                      className="h-8 w-8 rounded-lg bg-surface/50 border border-border flex items-center justify-center text-content/50 hover:text-accent hover:border-accent/30 transition-all"
                      title="Copy Email"
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={`mailto:${f.email}`}
                      className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </motion.a>
                  </div>
                )}
              </div>

              {/* Teams Tip */}
              <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/5 bg-blue-50/30 dark:bg-blue-900/5 rounded-xl p-3 flex gap-2.5 rtl:text-right" dir="rtl">
                <div className="shrink-0 w-6 h-6 rounded-md bg-[#4B53BC] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-accent-foreground fill-current">
                    <path d="M12.5 13.5C12.5 14.88 11.38 16 10 16C8.62 16 7.5 14.88 7.5 13.5C7.5 12.12 8.62 11 10 11C11.38 11 12.5 12.12 12.5 13.5ZM17 12V16.5C17 17.33 16.33 18 15.5 18H12.75L10 21V18H10C7.79 18 6 16.21 6 14C6 11.79 7.79 10 10 10H15.5C16.33 10 17 10.67 17 11.5V12ZM21 8.5C21 9.33 20.33 10 19.5 10H19V11.5C19 12.08 18.78 12.61 18.42 13C18.79 13 19 13.47 19 14V14.5C19 15.33 18.33 16 17.5 16H17V11.5C17 10.12 15.88 9 14.5 9H10C10 7.34 11.34 6 13 6H19.5C20.33 6 21 6.67 21 7.5V8.5Z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] font-bold text-[#4B53BC] dark:text-blue-400">
                    ملاحظة: حساب التيمز هو نفس البريد الجامعي {f.email ? `(${f.email.split('@')[0]})` : ''}.
                  </p>
                  {f.email && (
                    <p className="text-[9px] text-muted-foreground leading-tight">
                      يمكنك التواصل عبر Teams باستخدام اليوزر (Username) بدون @bau.edu.jo
                    </p>
                  )}
                </div>
              </div>

              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine pointer-events-none" />
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  );
}

const TAB_KEYS = ["summaries", "books", "exams", "videos"] as const;
type TabKey = typeof TAB_KEYS[number];

export default function VaultDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { t, lang, dir } = usePreferences();
  const [tab, setTab] = useState<TabKey | null>(null);
  const [showInstructors, setShowInstructors] = useState(false);

  if (!id) return null;
  const course = courses.find(c => c.id === id);
  const isAr = lang === "ar";

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-black text-foreground mb-2">
          {isAr ? "عذراً، هذه المادة غير متوفرة" : "Sorry, course not found"}
        </h2>
        <Button onClick={() => nav(-1)}>{t.common.back}</Button>
      </div>
    );
  }

  const resources = resourcesByCourse[course.id] || [];
  const filterType = (type: Resource["type"]) => resources.filter(r => r.type === type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <button
        onClick={() => nav(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
        {t.common.back}
      </button>

      {/* Course header */}
      <div className="bg-surface/80 border border-border shadow-sm backdrop-blur-xl rounded-[3rem] p-8 md:p-14 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors hidden md:block" />
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-[10px] md:text-[12px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {course.code}
          </span>
          <span className="text-[10px] md:text-[12px] font-black uppercase text-muted-foreground tracking-wider">
            {course.department} • {course.hours} {isAr ? "ساعات" : "hrs"}
          </span>
        </div>
        <h1 className="text-3xl md:text-6xl font-black text-foreground tracking-tighter leading-[1.2] break-words font-['Cairo']">
          {isAr ? course.nameAr : course.name}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center items-center mb-10 gap-2.5">
        {TAB_KEYS.map((k) => {
          const isActive = tab === k;
          const config = {
            summaries: { icon: FileText, label: t.vault.tabs.summaries, color: "#3b82f6" },
            books: { icon: BookMarked, label: t.vault.tabs.books, color: "#a855f7" },
            exams: { icon: FileCheck, label: t.vault.tabs.exams, color: "#10b981" },
            videos: { icon: Youtube, label: t.vault.tabs.videos, color: "#f43f5e" },
          }[k];

          return (
            <button
              key={k}
              onClick={() => setTab(isActive ? null : k)}
              className={cn(
                "relative flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs md:text-sm font-black transition-all duration-500 group overflow-hidden",
                isActive 
                  ? "text-primary-foreground shadow-xl" 
                  : "text-muted-foreground hover:text-foreground bg-surface/50 border border-transparent hover:border-border"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeVaultTab"
                  className="absolute inset-0 z-0"
                  style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)` }}
                />
              )}
              <config.icon className={cn("relative z-10 w-4 h-4", isActive && "scale-110")} />
              <span className="relative z-10">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Animated panel area */}
      <div className="relative min-h-[60vh]">
        <AnimatePresence mode="wait">
          {!tab ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-surface/30 border border-dashed border-border rounded-[3rem]"
            >
              <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mb-6 animate-bounce-slow">
                <Brain className="w-10 h-10 text-primary dark:text-accent" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                {isAr ? "استكشف محتويات المادة" : "Explore course content"}
              </h3>
              <p className="text-sm text-muted-foreground font-bold max-w-xs text-center px-4">
                {isAr ? "اختر أحد الأقسام أعلاه لعرض الملفات والملخصات المتوفرة" : "Select one of the sections above to view available files and summaries"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <MaterialList 
                items={filterType(tab === "summaries" ? "summary" : tab === "books" ? "book" : tab === "exams" ? "exam" : "video")} 
                emptyMessage={isAr ? "جاري العمل على إضافة المحتوى لهذا القسم ✨" : "Working on adding content for this section ✨"} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Optional Instructors Button & Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 flex flex-col items-center gap-8">
        <button
          onClick={() => setShowInstructors(!showInstructors)}
          className="group flex items-center gap-4 px-8 py-4 rounded-[1.5rem] bg-surface/50 border border-border hover:border-amber-500/30 transition-all shadow-sm active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-black text-foreground/80">
            {isAr ? "عرض مدرسي المادة" : "View Instructors"}
          </span>
        </button>

        <AnimatePresence>
          {showInstructors && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full overflow-hidden"
            >
              <div className="py-10 border-t border-border">
                <InstructorCards department={course.department} courseName={course.name} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contribute Section - Hidden on Mobile to simplify layout */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-8 rounded-[2.5rem] bg-surface/80 border border-border shadow-sm backdrop-blur-xl relative overflow-hidden group transition-all duration-500 hidden md:block"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-start flex-col md:flex-row">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-foreground mb-2">
                {lang === "ar" ? "شاركنا ملفاتك أو روابطك" : "Share your files or links"}
              </h4>
              <p className="text-muted-foreground font-medium max-w-lg leading-relaxed">
                {lang === "ar" ? "ساهم في إثراء محتوى هذه المادة وساعد زملائك." : "Contribute to this course and help others."}
              </p>
            </div>
          </div>
          <motion.a
            href={`https://api.whatsapp.com/send?phone=962785159906&text=${encodeURIComponent(isAr ? `مرحباً مرشد، أريد مشاركة ملفات لمادة: ${course.nameAr}` : `Hello Murshid, I want to share files for: ${course.name}`)}`}
            target="_blank"
            className="px-10 py-5 rounded-2xl bg-success text-success-foreground font-black hover:bg-success/90 shadow-xl"
          >
            {isAr ? "شاركنا الآن" : "Share Now"}
          </motion.a>
        </div>
      </motion.section>
    </motion.div>
  );
}
