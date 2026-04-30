import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Download, FileText, BookOpen,
  GraduationCap, PlayCircle, Library, Layers,
  ExternalLink, Share2, Youtube, MessageCircle,
  Book as BookIcon, ClipboardList, Video
} from "lucide-react";
import { 
  courses, resourcesByCourse, instructorsByCourse, 
  faculty, type Resource 
} from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import MaterialList from "@/components/MaterialList";
import { motion, AnimatePresence } from "framer-motion";



type TabType = 'videos' | 'summaries' | 'pastPapers' | 'textbook';

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";
  const [activeTab, setActiveTab] = useState<TabType | null>(null);
  const [showInstructors, setShowInstructors] = useState(false);

  const course = courses.find((c) => c.id === id);
  const resources = resourcesByCourse[id ?? ""] ?? [];
  const instructorIds = instructorsByCourse[id ?? ""] || [];
  const courseInstructors = (instructorIds || [])?.map(insId => faculty?.find(f => f.id === insId)).filter(Boolean) as typeof faculty;
  const simpleInstructors = course?.instructors || [];

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground animate-in fade-in duration-500">
        <div className="text-center">
          <GraduationCap className="h-20 w-20 text-slate-800 mb-6 mx-auto" />
          <h2 className="text-2xl font-black mb-4">{isAr ? "المادة غير موجودة" : "Course Not Found"}</h2>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 rounded-2xl bg-surface/5 border border-border hover:bg-surface/10 transition-all font-bold"
          >
            {isAr ? "العودة للخلف" : "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; labelAr: string; labelEn: string; icon: any; color: string }[] = [
    { id: 'videos', labelAr: "فيديوهات مرئية", labelEn: "Video Lessons", icon: Video, color: "#f43f5e" },
    { id: 'summaries', labelAr: "ملخصات ونوتات", labelEn: "Summaries", icon: ClipboardList, color: "#3b82f6" },
    { id: 'pastPapers', labelAr: "أسئلة سنوات", labelEn: "Past Papers", icon: FileText, color: "#10b981" },
    { id: 'textbook', labelAr: "الكتاب الجامعي", labelEn: "Textbook", icon: BookIcon, color: "#a855f7" },
  ];

  const getFilteredResources = () => {
    switch (activeTab) {
      case 'videos': return resources.filter(r => r.type === "video");
      case 'summaries': return resources.filter(r => r.type === "summary");
      case 'pastPapers': return resources.filter(r => r.type === "exam");
      case 'textbook': return resources.filter(r => r.type === "book");
      default: return [];
    }
  };

  return (
    <div 
      dir={dir} 
      className="min-h-screen pb-24 transition-colors duration-300 animate-in fade-in duration-500"
    >

      <div className="relative z-10 px-4 md:px-8 pt-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-surface/80 border border-border shadow-sm backdrop-blur-xl hover:border-accent/30 transition-all"
          >
            <ArrowLeft className={cn("w-4 h-4 text-muted-foreground group-hover:text-accent", dir === "rtl" ? "rotate-180" : "")} />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
              {isAr ? "العودة للخزانة" : "Back to Vault"}
            </span>
          </button>
        </div>

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
          <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter leading-[1.1] mb-2 break-words">
            {isAr ? course.nameAr : course.name}
          </h1>
        </div>

        <div className="z-40 mb-12 flex justify-center w-full px-2">
          <div className="p-2.5 rounded-[2rem] bg-surface/80 border border-border backdrop-blur-3xl shadow-2xl flex flex-wrap justify-center items-center gap-2.5 max-w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(isActive ? null : tab.id)}
                  className={cn(
                    "relative flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs md:text-sm font-black transition-all duration-500 group overflow-hidden",
                    isActive 
                      ? "text-primary-foreground shadow-xl bg-primary" 
                      : "text-muted-foreground hover:text-foreground bg-surface border border-border"
                  )}
                  style={isActive ? { background: `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)` } : {}}
                >
                  <Icon className={cn("relative z-10 w-4 h-4 transition-transform duration-300", isActive && "scale-110")} />
                  <span className="relative z-10">{isAr ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-[60vh] relative mb-20">
          <AnimatePresence mode="wait">
          {!activeTab ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-surface/40 border border-dashed border-border rounded-[3rem]"
            >
              <div className="w-20 h-20 rounded-[2.5rem] bg-accent/10 flex items-center justify-center mb-6">
                <Library className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                {isAr ? "اختر تصنيفاً للعرض" : "Select a category to view"}
              </h3>
              <p className="text-sm text-muted-foreground font-bold max-w-xs text-center px-4">
                {isAr ? "انقر على أحد الأزرار في الأعلى لاستعراض الملفات والمصادر" : "Click on one of the buttons above to explore files and resources"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <MaterialList 
                items={getFilteredResources()} 
                emptyMessage={isAr ? "سيتم إضافة المحتوى قريباً ✨" : "Content coming soon ✨"} 
              />
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        <div className="mt-20 mb-20 flex flex-col items-center gap-8">
          <button
            onClick={() => setShowInstructors(!showInstructors)}
            className="group flex items-center gap-4 px-8 py-4 rounded-[1.5rem] bg-surface/50 border border-border hover:border-accent/30 transition-all shadow-sm active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-black text-foreground/80">
              {isAr ? "عرض مدرسي المادة" : "View Instructors"}
            </span>
          </button>

          {showInstructors && (
            <div className="w-full overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12 border-t border-slate-200 dark:border-white/5">
                {courseInstructors.length > 0 ? (
                  courseInstructors.map((ins) => (
                    <div 
                      key={ins.id}
                      className="p-8 rounded-[2.5rem] bg-white/80 border border-slate-200 dark:bg-white/[0.03] dark:border-white/[0.08] flex items-center gap-5"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xl">
                        {ins.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-slate-900 dark:text-slate-100">
                          {isAr ? ins.nameAr : ins.name}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {isAr ? ins.titleAr : ins.title}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  simpleInstructors.map((name, index) => (
                    <div
                      key={index}
                      className="p-8 rounded-[2.5rem] bg-surface/80 border border-border flex items-center gap-5"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-foreground">
                          {name}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {isAr ? "مدرس معتمد" : "Certified Instructor"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <section 
          className="mt-32 relative overflow-hidden rounded-[3.5rem] p-1 bg-surface/80 border border-border shadow-sm backdrop-blur-xl transition-all duration-500 animate-in fade-in duration-1000"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--accent)/0.15),transparent)] pointer-events-none" />
          <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8 flex-col md:flex-row text-center md:text-start">
              <div className="w-20 h-20 rounded-[2.5rem] bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                <Share2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-3xl font-black text-foreground mb-3 tracking-tight">
                  {isAr ? "شاركنا مصادرك التعليمية" : "Share your educational resources"}
                </h4>
                <p className="text-muted-foreground font-bold text-lg leading-relaxed max-w-xl">
                  {isAr 
                    ? "عندك ملخص أو فيديو مفيد؟ شاركنا لتفيد غيرك" 
                    : "Have a helpful summary or video? Share it with us to benefit others."}
                </p>
              </div>
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=962785159906&text=${encodeURIComponent(isAr ? `مرحباً مرشد، أريد مشاركة محتوى جديد لمادة ${course.nameAr}` : `Hello Murshid, I want to share new content for ${course.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-12 py-6 rounded-[2.5rem] bg-accent text-accent-foreground font-black text-xl hover:bg-accent/80 transition-all shadow-xl whitespace-nowrap active:scale-95"
            >
              <MessageCircle className="w-7 h-7" />
              {isAr ? "شاركنا الآن" : "Share Now"}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
