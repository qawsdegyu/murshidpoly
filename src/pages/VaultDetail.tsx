import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, FileText, BookMarked, FileCheck, Brain, Download, User,
  GraduationCap, Mail, Phone, Copy, MapPin, Eye, Youtube, MessageCircle,
  Share2, Upload
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  courses, resourcesByCourse, instructorsByCourse, faculty, Resource,
} from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
const typeIcons: Record<string, any> = {
  summary: FileText,
  book: BookMarked,
  exam: FileCheck,
  video: Youtube,
};

interface ResourceListProps {
  items: Resource[];
  empty: string;
}

function ResourceList({ items, empty }: ResourceListProps) {
  const { t } = usePreferences();
  if (items.length === 0)
    return <div className="text-center py-12 text-muted-foreground text-sm">{empty}</div>;

  const getDownloadLink = (r: Resource) => {
    if ((r as any).downloadUrl) return (r as any).downloadUrl;
    if (!r.url) return null;
    const idMatch = r.url.match(/id=([a-zA-Z0-9_-]+)/) || r.url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
    }
    return r.url;
  };

  return (
    <div className="space-y-3">
      {items?.map((r, i) => {
        const Icon = typeIcons[r.type];
        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 bg-surface/80 border border-border shadow-sm backdrop-blur-xl dark:bg-surface/40 dark:border-white/10 dark:backdrop-blur-2xl rounded-xl p-4 hover:shadow-elegant transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center text-primary dark:text-accent shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{r.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <User className="h-3 w-3" /> {r.uploader} • {r.size}
                </div>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto gradient-primary text-primary-foreground hover:opacity-90 shadow-gold"
                onClick={() => {
                  const link = getDownloadLink(r);
                  if (link) window.open(link, "_blank", "noopener,noreferrer");
                }}
              >
                <Download className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                <span>{t.vault.download}</span>
              </Button>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function VideoGrid({ items, empty }: ResourceListProps) {
  const { t } = usePreferences();
  if (items.length === 0)
    return <div className="text-center py-12 text-muted-foreground text-sm">{empty}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items?.map((r, i) => {
        const videoId = r.url?.match(/(?:v=|youtu\.be\/|embed\/)([^&?]+)/)?.[1] || "default";
        
        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="bg-surface/80 border border-border shadow-sm backdrop-blur-xl dark:bg-surface/40 dark:border-white/10 dark:backdrop-blur-2xl rounded-xl overflow-hidden hover:shadow-elegant transition-all flex flex-col group"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 border-b border-white/5">
              <img 
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90" 
                alt={r.title}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; }}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-12 w-12 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                  <Youtube className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-tight text-slate-900 dark:text-slate-100">{r.title}</h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 mt-auto pt-2">{r.uploader}</div>
              
              <Button
                className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 shadow-none"
                onClick={() => r.url && window.open(r.url, "_blank", "noopener,noreferrer")}
              >
                <Youtube className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                <span>Watch on YouTube</span>
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

import { facultyList, FacultyMember } from "@/data/facultyData";
import { Search } from "lucide-react";

function InstructorCards({ department, courseName }: { department: string; courseName: string }) {
  const { t, lang, dir } = usePreferences();
  const [search, setSearch] = useState("");

  // Smart mapping: Course Department -> Faculty Department
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
    if (dept.includes("industrial")) return ["قسم الهندسة الميكانيكية"]; // Usually Mechanical in FET
    if (dept.includes("mechatronics")) return ["قسم هندسة الميكاترونكس", "قسم الهندسة الميكانيكية"];
    return ["كلية الهندسة التكنولوجية"];
  };

  const targetDepts = getMappedDepartments(department);
  
  // Filter by department first, then by search
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
      style={{ willChange: "transform, opacity" }}
      className="space-y-6"
    >
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          placeholder={lang === "ar" ? "ابحث عن مدرس..." : "Search for an instructor..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-surface/50 dark:bg-surface/10 border border-border dark:border-white/10 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm"
        />
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-12 bg-surface/30 dark:bg-surface/5 rounded-3xl border border-dashed border-border dark:border-white/10">
          <User className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden bg-surface/40 dark:bg-surface/5 border border-border/60 dark:border-white/10 backdrop-blur-2xl rounded-2xl p-5 hover:border-accent/30 hover:bg-surface/60 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-accent/20 flex items-center justify-center text-accent font-black text-lg shrink-0 shadow-lg">
                    {f.name.split(" ").filter(n => n.length > 2)[0]?.[0] || "د"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors truncate">
                      {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      {f.department}
                    </p>
                  </div>
                </div>

                {f.email && (
                  <div className="flex gap-1.5 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copy(f.email)}
                      className="h-8 w-8 rounded-lg bg-surface/50 dark:bg-surface/10 border border-border dark:border-white/10 flex items-center justify-center text-content/50 hover:text-accent hover:border-accent/30 transition-all"
                      title="Copy Email"
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={`mailto:${f.email}`}
                      className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all"
                      title="Send Email"
                    >
                      <Mail className="h-4 w-4" />
                    </motion.a>
                  </div>
                )}
              </div>

              {/* Decorative Glass Shine */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine pointer-events-none" />
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  );
}

const TAB_KEYS = ["summaries", "books", "exams", "videos", "instructors"] as const;
type TabKey = typeof TAB_KEYS[number];

export default function VaultDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { t, lang, dir } = usePreferences();
  const [tab, setTab] = useState<TabKey>("summaries");

  if (!id) return null;

  const courseId = id;
  const course = courses.find(c => c.id === courseId);
  const isAr = lang === "ar";

  if (!course) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[70vh] flex flex-col items-center justify-center p-6"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative h-24 w-24 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-2xl flex items-center justify-center">
            <GraduationCap className="h-12 w-12 text-primary dark:text-accent animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
          {isAr ? "عذراً، هذه المادة غير متوفرة" : "Sorry, course not found"}
        </h2>
        <p className="text-slate-500 text-center mb-8 max-w-xs font-medium">
          {isAr ? "ربما تم نقل الملفات أو تغيير رمز المادة. يمكنك البحث عنها في المكتبة." : "The files might have been moved or the course code changed."}
        </p>
        <Button 
          variant="outline" 
          className="rounded-2xl px-8 py-6 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-bold"
          onClick={() => nav(-1)}
        >
          {t.common.back}
        </Button>
      </motion.div>
    );
  }

  const resources = resourcesByCourse[course?.id || ""] || [];
  const instructorIds = instructorsByCourse[course?.id || ""] || [];
  const filterType = (type: Resource["type"]) => resources?.filter(r => r.type === type) || [];

  const tabTriggerClass =
    "data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-elegant py-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
    >
      <button
        onClick={() => nav(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
        {t.common.back}
      </button>

      {/* Course header */}
      <div className="bg-surface/80 border border-border shadow-sm backdrop-blur-xl dark:bg-surface/40 dark:border-white/10 dark:backdrop-blur-2xl rounded-3xl p-6 md:p-10 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -z-10 rounded-full group-hover:bg-primary/10 transition-colors hidden md:block" />
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-accent border border-primary/20">
            {course?.code || "N/A"}
          </span>
          <span className="text-[10px] font-black uppercase text-slate-400">
            {course?.department || "General"} • {course?.hours || 0} {isAr ? "ساعات" : "hrs"}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {isAr ? course?.nameAr : course?.name}
        </h1>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6 h-auto p-1 bg-surface/50 dark:bg-surface/10 border border-border dark:border-white/10 backdrop-blur-xl gap-1">
          <TabsTrigger value="summaries" className={tabTriggerClass}>
            <FileText className="h-4 w-4 ltr:mr-2 rtl:ml-2" />{t.vault.tabs.summaries}
          </TabsTrigger>
          <TabsTrigger value="books" className={tabTriggerClass}>
            <BookMarked className="h-4 w-4 ltr:mr-2 rtl:ml-2" />{t.vault.tabs.books}
          </TabsTrigger>
          <TabsTrigger value="exams" className={tabTriggerClass}>
            <FileCheck className="h-4 w-4 ltr:mr-2 rtl:ml-2" />{t.vault.tabs.exams}
          </TabsTrigger>
          <TabsTrigger value="videos" className={tabTriggerClass}>
            <Youtube className="h-4 w-4 ltr:mr-2 rtl:ml-2" />{t.vault.tabs.videos}
          </TabsTrigger>
          <TabsTrigger value="instructors" className={tabTriggerClass}>
            <GraduationCap className="h-4 w-4 ltr:mr-2 rtl:ml-2" />{t.vault.tabs.instructors}
          </TabsTrigger>
        </TabsList>

        {/* Animated panel area */}
        <div className="relative min-h-[200px]">
          <AnimatePresence>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <TabsContent value="summaries" forceMount={tab === "summaries" ? true : undefined} hidden={tab !== "summaries"}>
                <ResourceList items={filterType("summary")} empty={t.vault.empty} />
              </TabsContent>
              <TabsContent value="books" forceMount={tab === "books" ? true : undefined} hidden={tab !== "books"}>
                <ResourceList items={filterType("book")} empty={t.vault.empty} />
              </TabsContent>
              <TabsContent value="exams" forceMount={tab === "exams" ? true : undefined} hidden={tab !== "exams"}>
                <ResourceList items={filterType("exam")} empty={t.vault.empty} />
              </TabsContent>
              <TabsContent value="videos" forceMount={tab === "videos" ? true : undefined} hidden={tab !== "videos"}>
                <VideoGrid items={filterType("video")} empty={t.vault.empty} />
              </TabsContent>
              <TabsContent value="instructors" forceMount={tab === "instructors" ? true : undefined} hidden={tab !== "instructors"}>
                <InstructorCards department={course.department} courseName={course.name} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      {/* ── Contribute Section ── */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-8 rounded-[2.5rem] bg-surface/80 border border-border shadow-sm backdrop-blur-xl dark:bg-surface/40 dark:border-white/10 dark:backdrop-blur-2xl relative overflow-hidden group transition-all duration-500"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-start flex-col md:flex-row">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0px rgba(16,185,129,0)",
                  "0 0 20px rgba(16,185,129,0.2)",
                  "0 0 0px rgba(16,185,129,0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-2xl"
            >
              <Upload className="w-8 h-8" />
            </motion.div>
            <div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
                {lang === "ar" ? "شاركنا ملفاتك أو روابطك" : "Share your files or links"}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
                {lang === "ar" 
                  ? "ساهم في إثراء محتوى هذه المادة وساعد زملائك من خلال مشاركة مصادرك." 
                  : "Contribute to this course's content and help your colleagues by sharing your resources."}
              </p>
            </div>
          </div>

          <motion.a
            href={`https://api.whatsapp.com/send?phone=962785159906&text=${encodeURIComponent(lang === "ar" ? `مرحباً مرشد، أريد مشاركة ملفات لمادة: ${course?.nameAr || course?.name}` : `Hello Murshid, I want to share files for course: ${course?.name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald-500 text-white font-black text-lg hover:bg-emerald-400 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {lang === "ar" ? "شاركنا الآن" : "Share Now"}
          </motion.a>
        </div>
      </motion.section>
    </motion.div>
  );
}
