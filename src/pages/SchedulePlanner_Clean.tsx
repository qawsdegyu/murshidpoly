import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Scale, BookOpen, Search, Sparkles, Filter, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, Check, AlertTriangle, Download, Trash2, Plus, 
  Settings2, Layers, Info, Maximize2, Minimize2, Loader2, Table2, LayoutGrid, Edit
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isUserAdmin } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { majors, Course, faculty as facultyList } from "@/data/mockData";
import { roadmapNodes } from "@/data/roadmapData";
import { Section } from "@/data/sections";
import { supabase } from "@/lib/supabase";
import { getSuggestedCourses, generateSchedules as runGenerator, ScheduleOption } from "../services/schedule-service";
import PageHeader from "../components/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";

const WEEKDAYS = [
  { id: "sunday", label: "الأحد", labelEn: "Sunday" },
  { id: "monday", label: "الاثنين", labelEn: "Monday" },
  { id: "tuesday", label: "الثلاثاء", labelEn: "Tuesday" },
  { id: "wednesday", label: "الأربعاء", labelEn: "Wednesday" },
  { id: "thursday", label: "الخميس", labelEn: "Thursday" },
];

const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

export default function SchedulePlanner() {
  const { lang } = usePreferences();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = isUserAdmin(user?.email);
  const isAr = lang === "ar";
  
  // Selection State
  const [selectedMajor, setSelectedMajor] = useState("computer");
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [semesterType, setSemesterType] = useState<"regular" | "summer">("regular");
  const [targetHours, setTargetHours] = useState(15);
  const [mode, setMode] = useState<"plan" | "manual">("plan");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridScale, setGridScale] = useState(1); // 1 to 1.5
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  
  // Data State
  const [activePlan, setActivePlan] = useState<Course[]>([]);
  const [generatedSchedules, setGeneratedSchedules] = useState<ScheduleOption[]>([]);
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);

  // Database State
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [dbSections, setDbSections] = useState<Section[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'processing' | 'optimizing'>('idle');

  // Fetch Data from Supabase
  useEffect(() => {
    async function fetchData() {
      setIsDataLoading(true);
      try {
        const [coursesRes, sectionsRes] = await Promise.all([
          supabase.from('courses').select('*'),
          supabase.from('sections').select('*')
        ]);

        if (coursesRes.data) {
          const mappedCourses: Course[] = coursesRes.data.map(c => ({
            id: c.id,
            code: c.code,
            name: c.name_en || c.name_ar,
            nameAr: c.name_ar,
            hours: c.credit_hours,
            department: c.department,
            category: c.category || 'engineering'
          }));
          setDbCourses(mappedCourses);
        }

        if (sectionsRes.data) {
          const mappedSections: Section[] = sectionsRes.data.map(s => ({
            id: s.id.toString(),
            courseId: s.course_id,
            instructorId: 'manual',
            instructorName: s.instructor_name,
            days: Array.isArray(s.days) ? s.days : [],
            startTime: s.start_time,
            endTime: s.end_time,
            room: s.room
          }));
          setDbSections(mappedSections);
        }
      } catch (err) {
        console.error("Error fetching schedule data:", err);
        toast.error(isAr ? "فشل تحميل البيانات من السيرفر" : "Failed to load data from server");
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchData();
  }, []);

  // Derive level
  const selectedLevel = (selectedYear - 1) * 2 + (semesterType === "summer" ? 1 : selectedSemester);
  const maxHours = semesterType === "summer" ? 10 : 18;

  // Sync targetHours with maxHours
  useEffect(() => {
    if (targetHours > maxHours) {
      setTargetHours(maxHours);
    }
  }, [maxHours, targetHours]);

  // Roadmap Integration
  const recommendedCourses = useMemo(() => {
    if (isDataLoading) return [];
    const categoryMap: Record<string, string> = {
      "electrical_computer": "electrical",
      "computer": "computer",
      "civil": "civil",
      "mechatronics": "mechatronics",
      "mechanical": "mechanical",
      "chemical": "chemical",
      "autotronics": "mechanical"
    };
    const targetCategory = categoryMap[selectedMajor] || selectedMajor;
    const roadmapForMajor = roadmapNodes.filter(n => 
      (n.category === targetCategory || n.category === "common") && 
      n.level === selectedLevel
    );
    
    return dbCourses.filter(c => 
      roadmapForMajor.some(rn => rn.id === c.id || rn.fallbackNameAr === c.nameAr || rn.fallbackName === c.name) &&
      !activePlan.find(ap => ap.id === c.id)
    );
  }, [selectedMajor, selectedLevel, activePlan, dbCourses, isDataLoading]);

  // Initialize with suggested courses
  useEffect(() => {
    if (mode === "plan" && !isDataLoading && dbCourses.length > 0) {
      const suggestions = getSuggestedCourses(
        selectedMajor,
        selectedLevel,
        roadmapNodes,
        dbCourses,
        dbSections,
        targetHours
      );
      
      let sum = 0;
      const limitedSuggestions = suggestions.filter(c => {
        if (sum + c.hours <= targetHours) {
          sum += c.hours;
          return true;
        }
        return false;
      });
      
      setActivePlan(limitedSuggestions);
    }
  }, [mode, selectedMajor, selectedYear, selectedSemester, semesterType, targetHours, isDataLoading, dbCourses, dbSections]);

  const deleteCourseFromDB = async (courseId: string) => {
    if (!window.confirm(isAr ? "هل أنت متأكد من حذف هذه المادة نهائياً من قاعدة البيانات؟" : "Are you sure you want to delete this course permanently from the database?")) return;
    
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (!error) {
      setDbCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success(isAr ? "تم حذف المادة من قاعدة البيانات بنجاح" : "Course deleted from database successfully");
    } else {
      toast.error(isAr ? "فشل حذف المادة" : "Failed to delete course");
    }
  };

  const toggleCourse = (course: Course) => {
    setActivePlan(prev => {
      const exists = prev.find(c => c.id === course.id);
      if (exists) return prev.filter(c => c.id !== course.id);
      if (prev.reduce((acc, c) => acc + c.hours, 0) + course.hours > maxHours) {
        toast.error(isAr ? "تجاوزت الحد الأقصى للساعات" : "Max hours exceeded");
        return prev;
      }
      return [...prev, course];
    });
  };

  const handleGenerate = () => {
    if (activePlan.length === 0) {
      toast.error(isAr ? "الرجاء اختيار مواد أولاً" : "Please select courses first");
      return;
    }

    // Check if any selected course has NO sections
    const missingSections = activePlan.filter(c => 
      !dbSections.some(s => s.courseId === c.id)
    );

    if (missingSections.length > 0) {
      const names = missingSections.map(c => isAr ? c.nameAr : c.name).join(", ");
      toast.error(isAr 
        ? `المواد التالية ليس لها شُعب مضافة: ${names}` 
        : `The following courses have no sections: ${names}`
      );
      return;
    }

    setIsGenerating(true);
    setGenerationStep('processing');
    const rawSchedules = runGenerator(activePlan, dbSections);
    setIsGenerating(false);
    setGenerationStep('idle');
    
    if (rawSchedules.length === 0) {
      toast.error(isAr ? "تعذر العثور على جدول بدون تعارضات" : "No conflict-free schedules found");
      setGeneratedSchedules([]);
    } else {
      const options: ScheduleOption[] = rawSchedules.map(opt => ({
        sections: opt,
        totalHours: opt.reduce((sum, s) => {
          const c = dbCourses.find(course => course.id === s.courseId);
          return sum + (c?.hours || 0);
        }, 0)
      }));
      setGeneratedSchedules(options);
      setCurrentOptionIndex(0);
      toast.success(isAr ? `تم توليد ${options.length} خيارات متاحة` : `Generated ${options.length} options`);
    }
  };

  const handleDownload = () => {
    if (scheduleViews.tableItems.length === 0) {
      toast.error(isAr ? "لا يوجد جدول لتصديره" : "No schedule to export");
      return;
    }
    
    const itemsToSave = scheduleViews.tableItems.map((item: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      courseName: item.courseName || '',
      courseNameAr: item.courseNameAr || '',
      instructor: item.instructor || '',
      instructorAr: item.instructorAr || '',
      room: item.room || '',
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      days: item.days || []
    }));

    localStorage.setItem('my_schedule_data', JSON.stringify(itemsToSave));
    toast.success(isAr ? "تم تصدير الجدول إلى 'جدولي'" : "Schedule exported to 'My Schedule'");
    navigate('/my-schedule');
  };

  const scheduleViews = useMemo(() => {
    const option = generatedSchedules[currentOptionIndex];
    if (!option) return { gridItems: [], tableItems: [] };

    const gridItems: any[] = [];
    const tableItems: any[] = [];
    
    const dayMap: Record<number, string> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday"
    };
    const dayNamesAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
    const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu"];

    option.sections.forEach(s => {
      const course = dbCourses.find(c => c.id === s.courseId);
      const instr = facultyList.find(f => f.id === s.instructorId);
      
      const daysStrAr = s.days.map(d => dayNamesAr[d]).join(" - ");
      const daysStrEn = s.days.map(d => dayNamesEn[d]).join(" - ");

      tableItems.push({
        ...s,
        courseName: course?.name,
        courseNameAr: course?.nameAr,
        instructor: s.instructorName || instr?.name, // Use database instructor name if available
        instructorAr: s.instructorName || instr?.nameAr,
        daysStrAr,
        daysStrEn,
      });

      s.days.forEach(d => {
        gridItems.push({
          ...s,
          courseName: course?.name,
          courseNameAr: course?.nameAr,
          instructor: s.instructorName || instr?.name,
          instructorAr: s.instructorName || instr?.nameAr,
          startHour: parseInt(s.startTime.split(':')[0]),
          endHour: parseInt(s.endTime.split(':')[0]),
          day: dayMap[d]
        });
      });
    });

    return { gridItems, tableItems };
  }, [generatedSchedules, currentOptionIndex]);

  const totalHours = activePlan.reduce((sum, c) => sum + c.hours, 0);

  const filteredSearch = useMemo(() => {
    if (!searchQuery) return [];
    return dbCourses.filter(c => 
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       c.nameAr.includes(searchQuery) ||
       c.code.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !activePlan.find(ap => ap.id === c.id)
    );
  }, [searchQuery, activePlan, dbCourses]);

  // UI Constants
  const BASE_ROW_HEIGHT = 75;
  const ROW_HEIGHT = BASE_ROW_HEIGHT * gridScale;
  const GRID_HEIGHT = (TIME_SLOTS.length + 1) * ROW_HEIGHT;

  return (
    <div className="container mx-auto px-4 py-6 max-w-[1700px]">
      <PageHeader
        title={isAr ? "مخطط الجدولة الذكي" : "Smart Schedule Planner"}
        subtitle={isAr ? "صمم جدولك الدراسي بنقرة واحدة باستخدام الذكاء الاصطناعي بناءً على الخطة المعتمدة." : "Design your semester schedule in one click with AI based on your approved roadmap."}
        icon={<Calendar className="w-8 h-8" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 items-start">
        
        {/* Control Sidebar */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-5 lg:order-1">
          <div className="p-6 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-border/50 shadow-elegant">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70">{isAr ? "تخصيص الخطة" : "Customize"}</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground/60 uppercase block px-1">{isAr ? "التخصص" : "Major"}</label>
                <select 
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value)}
                  className="w-full bg-surface/50 border border-border/20 rounded-xl px-4 py-3 text-sm font-bold appearance-none transition-all outline-none"
                >
                  {majors.map(m => (
                    <option className="bg-background text-foreground" key={m.id} value={m.id}>{isAr ? m.nameAr : m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-black text-muted-foreground/60 uppercase block px-1">{isAr ? "السنة" : "Year"}</label>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full bg-surface/50 border border-border/20 rounded-xl px-4 py-3 text-sm font-bold appearance-none outline-none"
                  >
                    {[1,2,3,4,5].map(y => (
                      <option className="bg-background text-foreground" key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-muted-foreground/60 uppercase block px-1">{isAr ? "الفصل" : "Semester"}</label>
                  <select 
                    value={semesterType === "summer" ? 3 : selectedSemester}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val === 3) {
                        setSemesterType("summer");
                      } else {
                        setSemesterType("regular");
                        setSelectedSemester(val);
                      }
                    }}
                    className="w-full bg-surface/50 border border-border/20 rounded-xl px-4 py-3 text-sm font-bold appearance-none outline-none"
                  >
                    <option className="bg-background text-foreground" value={1}>{isAr ? "الأول" : "First"}</option>
                    <option className="bg-background text-foreground" value={2}>{isAr ? "الثاني" : "Second"}</option>
                    <option className="bg-background text-foreground" value={3}>{isAr ? "الصيفي" : "Summer"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-3 border-t border-border/10">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-black text-foreground/70">{isAr ? "الساعات المستهدفة" : "Target Hours"}</span>
                  <span className="text-base font-black text-accent">{targetHours}h</span>
                </div>
                <input 
                  type="range" 
                  min="9" 
                  max={maxHours} 
                  step="1"
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                  className="w-full accent-accent h-1 bg-border/20 rounded-full cursor-pointer"
                />
              </div>

              <button 
                onClick={handleGenerate}
                className="w-full bg-accent text-accent-foreground rounded-2xl py-3.5 flex items-center justify-center gap-3 font-black text-sm shadow-lg active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                {isAr ? "توليد الجدول" : "Generate Schedule"}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-border/50 shadow-elegant flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70">{isAr ? "المواد المختارة" : "Selected"}</h3>
              </div>
              <span className="bg-accent/10 text-accent text-xs font-black px-2 py-0.5 rounded-lg">{activePlan.length}</span>
            </div>

            <div className="flex gap-2 mb-4 p-1 bg-background/30 rounded-xl border border-border/20">
              <button onClick={() => setMode("plan")} className={cn("flex-1 py-1.5 text-xs font-black rounded-lg transition-all", mode === "plan" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground")}>{isAr ? "الخطة" : "Plan"}</button>
              <button onClick={() => setMode("manual")} className={cn("flex-1 py-1.5 text-xs font-black rounded-lg transition-all", mode === "manual" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground")}>{isAr ? "يدوي" : "Manual"}</button>
            </div>

            {mode === "manual" && (
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder={isAr ? "بحث..." : "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background/40 border border-border/20 rounded-xl text-sm font-bold py-3 pr-9 pl-3 outline-none"
                />
                <AnimatePresence>
                  {filteredSearch.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute z-50 w-full mt-1 bg-surface/95 border border-border shadow-xl rounded-xl max-h-48 overflow-y-auto">
                        {filteredSearch.map(c => (
                          <div key={c.id} className="w-full p-3 text-right hover:bg-accent/10 flex items-center justify-between group border-b border-border/5 last:border-0 transition-all">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { toggleCourse(c); setSearchQuery(""); }}
                                className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all shadow-sm"
                                title={isAr ? "إضافة للجدول" : "Add to Schedule"}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              
                              {isAdmin && (
                                <>
                                  <button 
                                    onClick={() => navigate(`/admin?tab=courses&edit=${c.id}`)}
                                    className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                    title={isAr ? "تعديل في الإدارة" : "Edit in Admin"}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => deleteCourseFromDB(c.id)}
                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title={isAr ? "حذف من القاعدة" : "Delete from DB"}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-black">{isAr ? c.nameAr : c.name}</span>
                              <span className="text-xs font-bold text-muted-foreground">{c.code}</span>
                            </div>
                          </div>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2.5 px-0.5 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {activePlan.length > 0 ? activePlan.map(course => (
                  <motion.div key={course.id} layout initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-3.5 rounded-2xl bg-background/20 border border-border/20 hover:border-accent/30 transition-all group relative">
                    <div className="flex justify-between items-start">
                      <button onClick={() => toggleCourse(course)} className="p-1 rounded-lg text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      <div className="text-right">
                        <h4 className="text-xs font-black leading-tight mb-0.5">{isAr ? course.nameAr : course.name}</h4>
                        <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-muted-foreground">
                          <span className="text-accent/60">{course.code}</span>
                          <span>{course.hours}h</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-30">
                    <Info className="w-8 h-8 mb-2" />
                    <p className="text-sm font-black">{isAr ? "لا توجد مواد مختارة" : "No courses selected"}</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 pt-4 border-t border-border/20">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-black uppercase text-muted-foreground">{isAr ? "إجمالي الساعات" : "Total Hours"}</span>
                <span className={cn("text-base font-black", totalHours > maxHours ? "text-destructive" : "text-accent")} dir="ltr">{totalHours} / {maxHours}h</span>
              </div>
              <div className="w-full bg-muted/10 rounded-full h-1 overflow-hidden">
                <motion.div animate={{ width: `${Math.min((totalHours / maxHours) * 100, 100)}%` }} className={cn("h-full rounded-full transition-all duration-500", totalHours > maxHours ? "bg-destructive" : "bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]")} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Schedule Grid */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-4 lg:order-2">
          <div className="flex items-center justify-between p-4 bg-surface/40 backdrop-blur-xl border border-border/50 rounded-[1.5rem] shadow-elegant">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2.5 px-5 py-2 bg-foreground text-background rounded-full text-sm font-black hover:opacity-90 transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                {isAr ? "تصدير إلى جدولي" : "Export to My Schedule"}
              </button>
              <div className="flex flex-col border-r border-border/20 pr-4 mr-2 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-4 rtl:mr-0 rtl:ml-2">
                <span className="text-xs font-black uppercase text-muted-foreground leading-none mb-0.5">{isAr ? "ساعات الجدول" : "HOURS"}</span>
                <span className="text-2xl font-black text-accent">{generatedSchedules[currentOptionIndex]?.totalHours || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-1 bg-background/50 rounded-xl border border-border/20">
                <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:bg-surface")}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode("table")} className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:bg-surface")}><Table2 className="w-4 h-4" /></button>
              </div>

              {viewMode === "grid" && (
                <div className="flex items-center gap-2 p-1 bg-background/50 rounded-xl border border-border/20">
                  <button onClick={() => setGridScale(prev => Math.max(0.8, prev - 0.1))} className="p-1.5 hover:bg-surface rounded-lg transition-all"><Minimize2 className="w-4 h-4 text-muted-foreground" /></button>
                  <span className="text-sm font-black min-w-[35px] text-center">{Math.round(gridScale * 100)}%</span>
                  <button onClick={() => setGridScale(prev => Math.min(1.5, prev + 0.1))} className="p-1.5 hover:bg-surface rounded-lg transition-all"><Maximize2 className="w-4 h-4 text-muted-foreground" /></button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentOptionIndex(prev => Math.max(0, prev - 1))}
                  className="p-2 rounded-lg bg-surface border border-border/50 hover:border-accent transition-all disabled:opacity-30"
                  disabled={currentOptionIndex === 0}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm font-black min-w-[3ch] text-center">{currentOptionIndex + 1}/{Math.max(1, generatedSchedules.length)}</span>
                <button 
                  onClick={() => setCurrentOptionIndex(prev => Math.min(generatedSchedules.length - 1, prev + 1))}
                  className="p-2 rounded-lg bg-surface border border-border/50 hover:border-accent transition-all disabled:opacity-30"
                  disabled={currentOptionIndex >= generatedSchedules.length - 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-elegant overflow-hidden">
            <div className="overflow-auto max-h-[750px] custom-scrollbar">
              {generatedSchedules.length > 0 ? (
                viewMode === "table" ? (
                  <div className="p-6 md:p-10 min-h-[500px]">
                    <div className="bg-[#f9f3d5] rounded-lg border-2 border-[#b0b0b0] shadow-md text-black font-sans relative overflow-hidden rtl:text-right">
                      {/* Paper Header */}
                      <div className="bg-[#f9f3d5] p-6 border-b-2 border-[#c0c0c0] flex justify-between items-start">
                        <div className="opacity-0 w-32"></div> {/* Spacer for balance */}
                        <div className="text-center">
                          <h2 className="text-2xl font-bold mb-1 tracking-wider text-[#222]">{isAr ? "مواعيد المحاضرات" : "Class Schedule"}</h2>
                          <div className="w-32 h-0.5 bg-[#888] mx-auto mt-2"></div>
                          <div className="w-24 h-0.5 bg-[#888] mx-auto mt-1"></div>
                        </div>
                        <div className="text-xs font-bold font-mono text-[#444] pt-2 whitespace-nowrap" dir="ltr">
                          {new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(',', '')}
                        </div>
                      </div>
                      
                      {/* Table Area */}
                      <div className="overflow-x-auto bg-[#f9f3d5]">
                        <table className="w-full border-collapse text-sm font-bold text-[#333]">
                          <thead>
                            <tr className="bg-[#d9d9d9]">
                              <th className="border-t-0 border-b-2 border-r-2 border-l-0 last:border-r-0 rtl:border-l-2 rtl:border-r-0 rtl:last:border-l-0 border-[#a0a0a0] py-4 px-6 w-1/4 text-center">{isAr ? "اسم المادة" : "Course Name"}</th>
                              <th className="border-t-0 border-b-2 border-r-2 border-l-0 last:border-r-0 rtl:border-l-2 rtl:border-r-0 rtl:last:border-l-0 border-[#a0a0a0] py-4 px-6 w-1/3 text-center">{isAr ? "موعد المحاضرة" : "Lecture Time"}</th>
                              <th className="border-t-0 border-b-2 border-r-2 border-l-0 last:border-r-0 rtl:border-l-2 rtl:border-r-0 rtl:last:border-l-0 border-[#a0a0a0] py-4 px-6 w-1/5 text-center">{isAr ? "القاعة" : "Room"}</th>
                              <th className="border-t-0 border-b-2 border-r-0 border-l-0 border-[#a0a0a0] py-4 px-6 text-center">{isAr ? "المدرس" : "Instructor"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleViews.tableItems.map((item, idx) => (
                              <tr key={idx} className="hover:bg-[#f0e8c0] transition-colors">
                                <td className="border-b border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] py-4 px-6 text-center">
                                  {isAr ? item.courseNameAr : item.courseName}
                                </td>
                                <td className="border-b border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] py-4 px-6 text-center leading-relaxed">
                                  <div className="mb-1">{isAr ? item.daysStrAr : item.daysStrEn}</div>
                                  <div className="text-xs text-[#555]">{item.startTime} - {item.endTime}</div>
                                </td>
                                <td className="border-b border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] py-4 px-6 text-center font-mono">
                                  {item.room}
                                </td>
                                <td className="border-b border-[#c0c0c0] py-4 px-6 text-center">
                                  {isAr ? item.instructorAr : item.instructor}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="relative p-4" style={{ height: `${GRID_HEIGHT}px`, minWidth: "800px" }}>
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-5 ml-14 rtl:ml-0 rtl:mr-14">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="border-r border-border/5 last:border-0" />
                    ))}
                  </div>
                  <div className="absolute inset-0 mt-12 ml-14 rtl:ml-0 rtl:mr-14">
                    {TIME_SLOTS.map((_, i) => (
                      <div key={i} className="border-b border-border/5" style={{ height: `${ROW_HEIGHT}px` }} />
                    ))}
                  </div>

                  <div className="relative h-full flex flex-col">
                    {/* Headers */}
                    <div className="h-12 grid grid-cols-5 ml-14 rtl:ml-0 rtl:mr-14 border-b border-border/20">
                      {WEEKDAYS.map(day => (
                        <div key={day.id} className="flex items-center justify-center">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground/60">{isAr ? day.label : day.labelEn}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 relative flex">
                      {/* Time Column */}
                      <div className="w-14 flex flex-col border-l rtl:border-l-0 rtl:border-r border-border/20">
                        {TIME_SLOTS.map((hour) => (
                          <div key={hour} className="flex items-start justify-center pt-2" style={{ height: `${ROW_HEIGHT}px` }}>
                            <span className="text-xs font-black text-muted-foreground/30">{hour}:00</span>
                          </div>
                        ))}
                      </div>

                      {/* Courses */}
                      <div className="flex-1 relative">
                        <AnimatePresence mode="popLayout">
                          {scheduleViews.gridItems.map((item, idx) => {
                            const duration = (item.endHour + (parseInt(item.endTime.split(':')[1]) / 60)) - (item.startHour + (parseInt(item.startTime.split(':')[1]) / 60));
                            const startOffset = (item.startHour - 8) + (parseInt(item.startTime.split(':')[1]) / 60);
                            const top = startOffset * ROW_HEIGHT;
                            const height = duration * ROW_HEIGHT;
                            const dayIndex = WEEKDAYS.findIndex(d => d.id === item.day);
                            
                            return (
                              <motion.div
                                key={`${item.courseId}-${item.day}-${idx}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute p-1 overflow-hidden group cursor-pointer transition-all hover:z-10"
                                style={{
                                  top: `${top}px`,
                                  height: `${height}px`,
                                  width: "20%",
                                  [isAr ? 'right' : 'left']: `${dayIndex * 20}%`,
                                }}
                              >
                                <div className="h-full w-full rounded-2xl bg-accent/15 border-2 border-accent/30 shadow-md shadow-accent/[0.02] backdrop-blur-md p-3 flex flex-col justify-between group-hover:bg-accent/25 group-hover:border-accent/50 transition-all border-l-4 border-l-accent">
                                  <div className="space-y-0.5 text-right">
                                    <h4 className="text-xs font-black leading-tight text-foreground line-clamp-2">{isAr ? item.courseNameAr : item.courseName}</h4>
                                    <div className="flex items-center justify-end gap-1.5 opacity-50">
                                      <span className="text-[10px] font-bold">{isAr ? item.instructorAr : item.instructor}</span>
                                      <User className="w-3 h-3" />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-1 text-[10px] font-black bg-surface/80 px-1.5 py-0.5 rounded-lg border border-border/20">
                                      <MapPin className="w-3 h-3 text-accent" />
                                      <span>{item.room}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-accent">
                                      <Clock className="w-3 h-3" />
                                      <span>{item.startTime}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-40 px-10 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                    <Calendar className="w-20 h-20 text-accent/40 relative z-10" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-2xl font-black opacity-40">{isAr ? "الجدول الأكاديمي سيظهر هنا" : "Academic Schedule View"}</h3>
                    <p className="text-sm font-bold text-muted-foreground max-w-sm mx-auto">
                      {isAr ? "بعد اختيار موادك وضبط الإعدادات، سيقوم الذكاء الاصطناعي برسم جدولك في هذه المساحة الواسعة." : "After selecting your courses and settings, AI will render your optimized schedule in this wide space."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
