import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, BookOpen, Search, Sparkles, Filter, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, Check, AlertTriangle, Download, Info, Loader2, Plus, Trash2
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import { majors, Course, faculty as facultyList } from "@/data/mockData";
import { roadmapNodes } from "@/data/roadmapData";
import { Section } from "@/data/sections";
import { currentSemesterCourses, currentSemesterSections } from "@/data/semester_catalog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getSuggestedCourses, generateSchedules as runGenerator, timeToMinutes } from "../services/schedule-service";
import ExamStudyPlanner from "@/components/ExamStudyPlanner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function SchedulePlanner() {
  const { lang } = usePreferences();
  const siteSettings = useSiteSettings();
  const isAr = lang === "ar";

  // Data State - Local Catalog (Jerida)
  const [courses] = useState(currentSemesterCourses);
  const [sections] = useState(currentSemesterSections);
  const [isLoading] = useState(false);

  // Form State
  const [selectedMajor, setSelectedMajor] = useState("computer");
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [semesterType, setSemesterType] = useState<"regular" | "summer">("regular");
  const [mode, setMode] = useState<"plan" | "manual">("plan");

  // Derive level
  const selectedLevel = (selectedYear - 1) * 2 + (semesterType === "summer" ? 1 : selectedSemester);

  const maxHours = semesterType === "summer" ? 10 : 18;
  const [targetHours, setTargetHours] = useState(15);

  // Sync targetHours with maxHours
  useEffect(() => {
    if (targetHours > maxHours) {
      setTargetHours(maxHours);
    }
  }, [maxHours, targetHours]);

  const [customCourses, setCustomCourses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatedSchedules, setGeneratedSchedules] = useState<Section[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // THE CORE LOGIC: Filter courses based on Roadmap AND available sections
  const activePlan = useMemo(() => {
    if (mode === "manual") {
      return customCourses.map(id => courses.find(c => c.id === id)).filter(Boolean) as Course[];
    }

    return getSuggestedCourses(
      selectedMajor,
      selectedLevel,
      roadmapNodes,
      courses,
      sections,
      targetHours
    );
  }, [selectedMajor, selectedLevel, mode, customCourses, targetHours, courses, sections]);

  const totalHours = activePlan.reduce((acc, c) => acc + (c.hours || 0), 0);
  const progress = (totalHours / maxHours) * 100;

  const handleGenerate = () => {
    if (activePlan.length === 0) {
      toast.error(isAr ? "يرجى اختيار مادة واحدة على الأقل" : "Please select at least one course");
      return;
    }

    const results = runGenerator(activePlan, sections);

    if (results.length === 0) {
      toast.error(isAr ? "تعذر العثور على جدول بدون تعارض. حاول تقليل عدد الساعات أو تغيير المواد." : "No conflict-free schedule found. Try reducing hours or changing courses.");
    } else {
      setGeneratedSchedules(results);
      setCurrentIndex(0);
      toast.success(isAr ? `تم العثور على ${results.length} خيارات ذكية لجدولك` : `Found ${results.length} smart options for your schedule`);
    }
  };

  const currentSchedule = generatedSchedules[currentIndex] || [];

  return (
    <div className="relative min-h-screen pb-20 pt-0 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
      <PageHeader
        title={isAr ? "مخطط الجدول الذكي" : "Smart Schedule Planner"}
        subtitle={isAr
          ? "نظام الجدول الذكي الذي يساعدك في بناء جدولك بناءً على تخصصك والمواد المتاحة"
          : "Let our smart algorithm build your ideal schedule based on your major and available sections."}
      />
      {siteSettings.exam_study_planner_enabled !== "false" && <ExamStudyPlanner />}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-12 items-start">

        {/* 1. Right Control Panel (Customization) - order-1 (Narrower) */}
        <div className="lg:col-span-2 space-y-6 lg:order-1">
          <div className="p-4 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-border/50 shadow-sm space-y-6">
            <h3 className="text-xs font-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              {isAr ? "الإعدادات" : "Settings"}
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-muted-foreground opacity-60">{isAr ? "التخصص" : "Major"}</label>
                <select value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)} className="w-full bg-background/50 border border-border rounded-xl px-2 py-2 text-[10px] font-bold outline-none appearance-none">
                  {majors.map(m => <option key={m.id} value={m.id} className="bg-[#0D0D0D] text-white">{isAr ? m.nameAr : m.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-muted-foreground opacity-60">{isAr ? "السنة/الفصل" : "Y/S"}</label>
                  <div className="flex gap-1">
                    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="flex-1 bg-background/50 border border-border rounded-lg px-1 py-1.5 text-[10px] font-bold outline-none">
                      {[1,2,3,4,5].map(y => <option key={y} value={y} className="bg-[#0D0D0D] text-white">{y}</option>)}
                    </select>
                    <select
                      value={semesterType === "summer" ? 3 : selectedSemester}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val === 3) { setSemesterType("summer"); setSelectedSemester(1); }
                        else { setSemesterType("regular"); setSelectedSemester(val); }
                      }}
                      className="flex-1 bg-background/50 border border-border rounded-lg px-1 py-1.5 text-[10px] font-bold outline-none"
                    >
                      <option value={1} className="bg-[#0D0D0D] text-white">1</option>
                      <option value={2} className="bg-[#0D0D0D] text-white">2</option>
                      <option value={3} className="bg-[#0D0D0D] text-white">S</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/20 space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-[9px] font-black text-muted-foreground opacity-60">{isAr ? "الساعات" : "Hrs"}</label>
                   <span className="text-[10px] font-black text-accent">{targetHours}</span>
                </div>
                <input
                  type="range" min="3" max={maxHours} step="1" value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                  className="w-full accent-accent h-1 rounded-lg appearance-none bg-background/50 cursor-pointer"
                />
              </div>

              <button
                onClick={handleGenerate}
                className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-black flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAr ? "توليد الجدول" : "Generate"}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Middle Weekly Grid (The Table) - order-2 (MAXIMIZED 8 COLUMNS) */}
        <div className="lg:col-span-8 space-y-6 lg:order-2">
          {generatedSchedules.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-surface/40 p-4 rounded-3xl border border-border/50">
                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0} className="p-2 rounded-xl bg-background border border-border disabled:opacity-30">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <p className="font-black text-sm">
                    {isAr ? `الخيار ${currentIndex + 1} من ${generatedSchedules.length}` : `Option ${currentIndex + 1} of ${generatedSchedules.length}`}
                  </p>
                  <button onClick={() => setCurrentIndex(prev => Math.min(generatedSchedules.length - 1, prev + 1))} disabled={currentIndex === generatedSchedules.length - 1} className="p-2 rounded-xl bg-background border border-border disabled:opacity-30">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline text-[10px] font-black text-muted-foreground uppercase bg-background/40 px-3 py-1.5 rounded-full border border-border/50">
                    {activePlan.reduce((acc, c) => acc + c.hours, 0)} {isAr ? "ساعة معتمدة" : "Credits"}
                  </span>
                  <button className="p-2.5 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative p-2 md:p-6 rounded-[3rem] bg-surface/60 border border-border/50 overflow-x-auto shadow-2xl shadow-background/20">
                <div className="min-w-[750px]">
                  <div className="grid grid-cols-6 gap-3 mb-6">
                    <div className="h-10" />
                    {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"].map(day => (
                      <div key={day} className="text-center font-black text-xs text-muted-foreground opacity-50 uppercase tracking-[0.2em]">{day}</div>
                    ))}
                  </div>
                  <div className="relative">
                    {[8,9,10,11,12,1,2,3,4,5].map(h => (
                      <div key={h} className="grid grid-cols-6 gap-3 h-20 border-t border-border/10 group">
                        <div className="text-[10px] font-black text-muted-foreground/30 flex items-center justify-center group-hover:text-accent/40 transition-colors">{h}:00</div>
                        <div className="col-span-5 relative" />
                      </div>
                    ))}
                    {currentSchedule.map((s, idx) => {
                      const course = courses.find(c => c.id === s.courseId);
                      return s.days.map(dayIdx => {
                        const startMin = timeToMinutes(s.startTime);
                        const endMin = timeToMinutes(s.endTime);
                        const top = ((startMin - 8 * 60) / 60) * 80;
                        const height = ((endMin - startMin) / 60) * 80;
                        return (
                          <motion.div
                            key={`${s.id}-${dayIdx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ position: 'absolute', top: `${top + 4}px`, left: `${(dayIdx + 1) * (100 / 6)}%`, width: `${(100 / 6) - 1}%`, height: `${height - 4}px` }}
                            className={cn(
                              "rounded-2xl p-3 border shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.03] hover:z-30 transition-all",
                              idx % 3 === 0 ? "bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-blue-500/5" :
                              idx % 3 === 1 ? "bg-accent/20 border-accent/30 text-accent shadow-accent/5" :
                              "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5"
                            )}
                          >
                            <div className="min-w-0">
                               <p className="text-[9px] font-black opacity-50 truncate mb-1">{course?.code}</p>
                               <p className="text-[11px] font-black leading-tight line-clamp-2">{isAr ? course?.nameAr : course?.name}</p>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-current/10">
                              <p className="text-[9px] font-bold opacity-70 flex items-center gap-1 truncate">
                                <User className="w-2.5 h-2.5" />
                                {s.instructorId}
                              </p>
                              <p className="text-[9px] font-black opacity-40">{s.room}</p>
                            </div>
                          </motion.div>
                        );
                      });
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] rounded-[4rem] bg-surface/20 border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-center p-12 group hover:bg-surface/30 transition-all">
               <div className="relative mb-6">
                 <Calendar className="w-16 h-16 text-accent/20 group-hover:scale-110 transition-transform" />
                 <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
               </div>
               <h3 className="text-2xl font-black opacity-40 mb-3">{isAr ? "الجدول الأكاديمي سيظهر هنا" : "Academic Schedule View"}</h3>
               <p className="text-sm font-bold text-muted-foreground max-w-sm">{isAr ? "بعد اختيار موادك وضبط الإعدادات، سيقوم الذكاء الاصطناعي برسم جدولك في هذه المساحة الواسعة." : "After selecting your courses and settings, AI will render your optimized schedule in this wide space."}</p>
            </div>
          )}
        </div>

        {/* 3. Left Sidebar (Selected Materials) - order-3 (Narrower) */}
        <div className="lg:col-span-2 space-y-6 lg:order-3">
          <div className="p-4 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-border/50 shadow-sm flex flex-col h-full min-h-[450px]">
            <h3 className="text-xs font-black mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              {isAr ? "المواد" : "Courses"}
            </h3>

            <div className="flex p-0.5 bg-background/50 rounded-lg border border-border mb-4">
              <button onClick={() => setMode("plan")} className={cn("flex-1 py-1 rounded-md text-[9px] font-black transition-all", mode === "plan" ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
                {isAr ? "الخطة" : "Plan"}
              </button>
              <button onClick={() => setMode("manual")} className={cn("flex-1 py-1 rounded-md text-[9px] font-black transition-all", mode === "manual" ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
                {isAr ? "يدوي" : "Manual"}
              </button>
            </div>

            {mode === "manual" && (
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "بحث..." : "Search..."}
                  className="w-full bg-background/30 border border-border rounded-lg pl-6 pr-2 py-1.5 text-[9px] font-bold outline-none"
                />
              </div>
            )}

            <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
              {activePlan.map(c => (
                <div key={c.id} className="p-2.5 rounded-xl bg-background/40 border border-border/20 group hover:border-accent/40 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-black text-accent">{c.code}</span>
                    {mode === "manual" && (
                      <button onClick={() => setCustomCourses(prev => prev.filter(cid => cid !== c.id))} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] font-bold leading-tight mt-1 line-clamp-2">{isAr ? c.nameAr : c.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}