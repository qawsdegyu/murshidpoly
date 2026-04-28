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

import { motion as m, AnimatePresence, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } }
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const getDownloadLink = (r: Resource) => {
  if (!r.url) return null;
  const idMatch = r.url.match(/id=([a-zA-Z0-9_-]+)/) || r.url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
  }
  return r.url;
};

type TabType = 'videos' | 'summaries' | 'pastPapers' | 'textbook' | 'instructors';

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";
  const [activeTab, setActiveTab] = useState<TabType>('videos');

  const course = courses.find((c) => c.id === id);
  const resources = resourcesByCourse[id ?? ""] ?? [];
  const instructorIds = instructorsByCourse[id ?? ""] || [];
  const courseInstructors = (instructorIds || [])?.map(insId => faculty?.find(f => f.id === insId)).filter(Boolean) as typeof faculty;
  
  // New: Get simple instructor names from course object
  const simpleInstructors = course?.instructors || [];

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <GraduationCap className="h-20 w-20 text-slate-800 mb-6 mx-auto" />
          <h2 className="text-2xl font-black mb-4">{isAr ? "المادة غير موجودة" : "Course Not Found"}</h2>
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold"
          >
            {isAr ? "العودة للخلف" : "Go Back"}
          </button>
        </m.div>
      </div>
    );
  }

  const tabs: { id: TabType; labelAr: string; labelEn: string; icon: any; color: string }[] = [
    { id: 'videos', labelAr: "فيديوهات مرئية", labelEn: "Video Lessons", icon: Video, color: "#f43f5e" },
    { id: 'summaries', labelAr: "ملخصات ونوتات", labelEn: "Summaries", icon: ClipboardList, color: "#3b82f6" },
    { id: 'pastPapers', labelAr: "أسئلة سنوات", labelEn: "Past Papers", icon: FileText, color: "#10b981" },
    { id: 'textbook', labelAr: "الكتاب الجامعي", labelEn: "Textbook", icon: BookIcon, color: "#a855f7" },
    { id: 'instructors', labelAr: "مدرسو المادة", labelEn: "Instructors", icon: GraduationCap, color: "#f59e0b" },
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

  const filteredResources = getFilteredResources();
  const currentTabInfo = tabs.find(t => t.id === activeTab);

  return (
    <m.div 
      dir={dir} 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="min-h-screen pb-24 bg-background selection:bg-cyan-500/30 transition-colors duration-300"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 bg-blue-600 hidden md:block" />
      </div>

      <m.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-4 md:px-8 pt-8 max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <m.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex-1">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 mb-10 px-6 py-2.5 rounded-2xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl hover:border-slate-300 dark:hover:border-white/[0.2] transition-all"
            >
              <ArrowLeft className={cn("w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors", dir === "rtl" ? "rotate-180" : "")} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {isAr ? "العودة للخزانة" : "Back to Vault"}
              </span>
            </button>

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center shadow-2xl shadow-blue-500/10">
                <BookOpen className="w-10 h-10 md:w-12 h-12 text-blue-500" strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-black text-blue-500 uppercase tracking-widest">
                    {course.code}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    {course.hours} {isAr ? "ساعات" : "Hours"}
                  </span>
                </div>
                  <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-slate-900 dark:text-slate-100">
                    {isAr ? course.nameAr : course.name}
                  </h1>
                  
                  {course.id.startsWith("plab") && (
                    <m.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        {isAr ? "مادة عملية / مختبر" : "Practical / Lab"}
                      </span>
                    </m.div>
                  )}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-2 text-end">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">{isAr ? "القسم الأكاديمي" : "Department"}</div>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-300">
              {course?.department}
            </div>
          </div>
        </m.div>

        {/* Sleek Tabs Navigation */}
        <div className="sticky top-6 z-40 mb-12 flex justify-center">
          <div className="p-1.5 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 backdrop-blur-3xl shadow-2xl shadow-blue-500/5 flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-full">
            {tabs?.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-3 px-6 py-3.5 rounded-[2rem] text-sm font-black transition-all duration-500 whitespace-nowrap group",
                    isActive 
                      ? "text-white shadow-lg" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <m.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-[2rem] z-0"
                      style={{ background: `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                  <Icon className={cn("relative z-10 w-4 h-4 transition-transform duration-300", isActive && "scale-110")} />
                  <span className="relative z-10">{isAr ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content with AnimatePresence */}
        <div className="min-h-[400px]">
          <AnimatePresence>
            <m.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {activeTab === 'instructors' ? (
                /* Instructors Tab Content */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {simpleInstructors.length > 0 ? (
                    simpleInstructors?.map((name, index) => (
                      <m.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-[2.5rem] bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl group hover:border-amber-500/30 transition-all duration-500 flex items-center gap-5"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                          <GraduationCap className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {name}
                          </h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {isAr ? "مدرس معتمد" : "Certified Instructor"}
                          </p>
                        </div>
                      </m.div>
                    ))
                  ) : (
                    /* Fallback to original instructors section data if new array is empty */
                    courseInstructors?.map((ins) => (
                      <m.div 
                        key={ins.id}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-[2.5rem] bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl group hover:border-amber-500/30 transition-all duration-500 flex items-center gap-5"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner font-black text-xl">
                          {ins.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {isAr ? ins.nameAr : ins.name}
                          </h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {isAr ? ins.titleAr : ins.title}
                          </p>
                        </div>
                      </m.div>
                    ))
                  )}
                  {(simpleInstructors.length === 0 && courseInstructors.length === 0) && (
                    <m.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="col-span-full flex flex-col items-center justify-center py-24 bg-white/40 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]"
                    >
                      <div className="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6">
                        <GraduationCap className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">
                        {isAr ? "سيتم إضافة المدرسين قريباً" : "Instructors coming soon"}
                      </h3>
                    </m.div>
                  )}
                </div>
              ) : (
                /* Original Tabs Content */
                filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources?.map((item) => {
                      const isVideo = item.type === "video";
                      return (
                        <m.div
                          key={item.id}
                          whileHover={{ y: -5 }}
                          className="group relative flex flex-col p-6 rounded-[2.5rem] bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl overflow-hidden hover:border-slate-300 dark:hover:border-white/[0.15] transition-all duration-500"
                        >
                          <div 
                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 pointer-events-none"
                            style={{ background: currentTabInfo?.color }}
                          />
                          
                          <div className="flex items-center justify-between mb-6">
                            <div 
                              className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/[0.1] shadow-lg"
                              style={{ background: `${currentTabInfo?.color}15`, color: currentTabInfo?.color }}
                            >
                              {isVideo ? <Youtube className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {item.size !== "N/A" ? item.size : (isAr ? "مصدر" : "Resource")}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 mb-8 font-medium">
                            {isAr ? "بواسطة" : "Uploaded by"}: {item.uploader}
                          </p>

                          <div className="mt-auto">
                            <button
                              onClick={() => {
                                const link = isVideo ? item.url : getDownloadLink(item);
                                if (link) window.open(link, "_blank", "noopener,noreferrer");
                              }}
                              className={cn(
                                "w-full py-4 rounded-[1.5rem] text-sm font-black transition-all flex items-center justify-center gap-3",
                                isVideo 
                                  ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                  : "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white"
                              )}
                            >
                              {isVideo ? (
                                <>
                                  <span>{isAr ? "شاهد الآن" : "Watch Now"}</span>
                                  <ExternalLink className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  <span>{isAr ? "تحميل الآن" : "Download Now"}</span>
                                  <Download className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </m.div>
                      );
                    })}
                  </div>
                ) : (
                  <m.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 bg-white/40 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]"
                  >
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6">
                      <Layers className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">
                      {isAr ? "سيتم إضافة المحتوى قريباً" : "Content coming soon"}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {isAr ? "نحن نعمل على توفير أفضل المصادر لهذه المادة" : "We are working on providing the best resources for this course"}
                    </p>
                  </m.div>
                )
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Instructors Section (Keeping original as well, but now it's also a tab) */}
        {courseInstructors.length > 0 && activeTab !== 'instructors' && (
          <m.section variants={fadeUp} className="mt-32">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {isAr ? "مدرسو المساق" : "Course Instructors"}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courseInstructors?.map((ins) => (
                <m.div 
                  key={ins.id}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-[2.5rem] bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl group hover:border-amber-500/30 transition-all duration-500"
                >
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xl shadow-inner">
                      {ins.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {isAr ? ins.nameAr : ins.name}
                      </h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {isAr ? ins.titleAr : ins.title}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{ins.email}</span>
                    </div>
                    {ins.teamsLink && (
                      <a 
                        href={ins.teamsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{isAr ? "تواصل عبر تيمز" : "Contact on Teams"}</span>
                      </a>
                    )}
                  </div>
                </m.div>
              ))}
            </div>
          </m.section>
        )}

        {/* Persistent WhatsApp Call to Action */}
        <m.section 
          variants={fadeUp} 
          className="mt-32 relative overflow-hidden rounded-[3.5rem] p-1 bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl transition-all duration-500"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.15),transparent)] pointer-events-none" />
          
          <div className="relative z-10 p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8 flex-col md:flex-row text-center md:text-start">
              <m.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0px rgba(16,185,129,0)",
                    "0 0 30px rgba(16,185,129,0.3)",
                    "0 0 0px rgba(16,185,129,0)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-[2.5rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-2xl"
              >
                <Share2 className="w-10 h-10" />
              </m.div>
              <div>
                <h4 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
                  {isAr ? "شاركنا مصادرك التعليمية" : "Share your educational resources"}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 font-bold text-lg leading-relaxed max-w-xl">
                  {isAr 
                    ? "عندك ملخص أو فيديو مفيد؟ شاركنا لتفيد غيرك" 
                    : "Have a helpful summary or video? Share it with us to benefit others."}
                </p>
              </div>
            </div>

            <m.a
              href={`https://api.whatsapp.com/send?phone=962785159906&text=${encodeURIComponent(
                isAr 
                  ? (course.id === "c2" 
                      ? "مرحباً مرشد، لدي ملخصات إضافية لمادة Calculus 102" 
                      : course.id === "p101"
                        ? "مرحباً مرشد، لدي ملخصات أو أسئلة سنوات لمادة الفيزياء 101"
                      : course.id === "p102"
                        ? "مرحباً مرشد، أريد إضافة تلاخيص أو نوتات لمادة الفيزياء 102"
                      : course.id === "plab101"
                        ? "مرحباً مرشد، لدي تقارير جاهزة (Reports) أو نماذج امتحانات لمختبر الفيزياء 101"
                      : course.id === "stat101"
                        ? "مرحباً مرشد، لدي ملخصات أو قوانين جاهزة لمادة الإحصاء والاحتمالات"
                      : course.id === "numerical"
                        ? "مرحباً مرشد، لدي ملخصات أو طرق حل بالآلة الحاسبة لمادة التقنيات العددية"
                      : course.id === "programming_cpp"
                        ? "مرحباً مرشد، لدي ملخصات أو أكواد برمجية (Examples) لمادة البرمجة"
                        : `مرحباً مرشد، أريد مشاركة محتوى جديد لمادة ${course.nameAr}`)
                  : (course.id === "c2" 
                      ? "Hello Murshid, I have extra summaries for Calculus 102" 
                      : course.id === "p101"
                        ? "Hello Murshid, I have summaries or past papers for Physics 101"
                      : course.id === "p102"
                        ? "Hello Murshid, I want to add summaries or notes for Physics 102"
                      : course.id === "plab101"
                        ? "Hello Murshid, I have reports or exam samples for Physics Lab 101"
                      : course.id === "stat101"
                        ? "Hello Murshid, I have summaries or ready formulas for Statistics"
                      : course.id === "numerical"
                        ? "Hello Murshid, I have summaries or calculator tricks for Numerical"
                      : course.id === "programming_cpp"
                        ? "Hello Murshid, I have summaries or code examples for Programming"
                        : `Hello Murshid, I want to share new content for ${course.name}`)
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 px-12 py-6 rounded-[2.5rem] bg-emerald-500 text-white font-black text-xl hover:bg-emerald-400 transition-all shadow-[0_25px_50px_-12px_rgba(16,185,129,0.5)] whitespace-nowrap"
            >
              <MessageCircle className="w-7 h-7" />
              {isAr ? "شاركنا الآن" : "Share Now"}
            </m.a>
          </div>
        </m.section>
      </m.div>
    </m.div>
  );
}
