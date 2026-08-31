
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Scale, BookOpen, Search, Sparkles, Filter, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, Check, AlertTriangle, Download, Trash2, Plus,
  Settings2, Layers, Info, Maximize2, Minimize2, Loader2, Table2, LayoutGrid, Edit, AlertCircle, X, Layout, Camera
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isUserAdmin } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { majors, Course, faculty as facultyList } from "@/data/mockData";
import { roadmapNodes } from "@/data/roadmapData";
import { Section } from "@/data/sections";
import { supabase } from "@/lib/supabase";
import { getSuggestedCourses, generateSchedules as runGenerator, ScheduleOption, findConflicts } from "../services/schedule-service";
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
  const navigate = useNavigate();
  const scheduleRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { lang } = usePreferences();
  const isAr = lang === "ar";
  const isAdmin = isUserAdmin(user?.email);

  const [isSelectionReviewOpen, setIsSelectionReviewOpen] = useState(false);

  // Selection State
  const [selectedMajor, setSelectedMajor] = useState(user?.user_metadata?.major || "computer");
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
  const [aiIntent, setAiIntent] = useState<'balanced' | 'relaxed' | 'compressed'>('balanced');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

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
        console.log("Fetching courses and sections from Supabase...");
        const [coursesRes, sectionsRes] = await Promise.all([
          supabase.from('courses').select('*'),
          supabase.from('sections').select('*')
        ]);

        if (coursesRes.error) {
          console.error("Supabase Courses Error:", coursesRes.error);
          throw new Error(`Courses: ${coursesRes.error.message}`);
        }
        if (sectionsRes.error) {
          console.error("Supabase Sections Error:", sectionsRes.error);
          throw new Error(`Sections: ${sectionsRes.error.message}`);
        }

        console.log(`Fetched ${coursesRes.data?.length || 0} courses and ${sectionsRes.data?.length || 0} sections.`);

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

        if ((!coursesRes.data || coursesRes.data.length === 0) && (!sectionsRes.data || sectionsRes.data.length === 0)) {
          toast.warning(isAr ? "قاعدة البيانات فارغة حالياً" : "Database is currently empty");
        }
      } catch (err: any) {
        console.error("Critical Schedule Fetch Error:", err);
        toast.error(isAr
          ? `خطأ في الاتصال بقاعدة البيانات: ${err.message}`
          : `Database Connection Error: ${err.message}`
        );
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch User Profile Major
  useEffect(() => {
    if (user) {
      const fetchProfileMajor = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('major')
          .eq('id', user.id)
          .single();
        if (data?.major) {
          setSelectedMajor(data.major);
        }
      };
      fetchProfileMajor();
    }
  }, [user]);

  // Category Mapping
  const targetCategoryMemo = useMemo(() => {
    const categoryMap: Record<string, string> = {
      "electrical_computer": "electrical",
      "computer": "computer",
      "civil": "civil",
      "mechatronics": "mechatronics",
      "mechanical": "mechanical",
      "chemical": "chemical",
      "autotronics": "mechanical"
    };
    return categoryMap[selectedMajor] || selectedMajor;
  }, [selectedMajor]);

  // Derive level
  const selectedLevel = (selectedYear - 1) * 2 + (semesterType === "summer" ? 1 : selectedSemester);
  const maxHours = semesterType === "summer" ? 10 : 18;

  // Sync targetHours with maxHours
  useEffect(() => {
    if (targetHours > maxHours) {
      setTargetHours(maxHours);
    }
  }, [maxHours, targetHours]);

  // Roadmap Integration - Filtered by 'Materials Newspaper' (actual available sections)
  const recommendedCourses = useMemo(() => {
    if (isDataLoading) return [];
    const targetCategory = targetCategoryMemo;
    const roadmapForMajor = roadmapNodes.filter(n =>
      (n.category === targetCategory || n.category === "common")
    );

    // Get only courses that are in the roadmap AND have at least one section in the current DB (newspaper)
    return dbCourses.filter(c => {
      const isInRoadmap = roadmapForMajor.some(rn =>
        rn.id === c.id || rn.id === c.code || rn.fallbackNameAr === c.nameAr || rn.fallbackName === c.name
      );
      if (!isInRoadmap) return false;

      // Check if it exists in the 'Materials Newspaper' (dbSections)
      return dbSections.some(s => s.courseId === c.id || s.courseId === c.code);
    });
  }, [selectedMajor, dbCourses, dbSections, isDataLoading, targetCategoryMemo]);

  // Initialize with suggested courses
  useEffect(() => {
    // We only fetch data once, and we DON'T auto-fill activePlan anymore
  }, [mode, isDataLoading, dbCourses]);

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

  // Helper to normalize course codes for better matching
  const normalizeCode = (code: string) => code.replace(/[\s-]/g, '').toUpperCase();

  const toggleCourse = (course: Course) => {
    setActivePlan(prev => {
      const exists = prev.find(p =>
        (p.code && course.code && normalizeCode(p.code) === normalizeCode(course.code)) ||
        (p.id === course.id) ||
        (p.nameAr === course.nameAr)
      );

      let nextPlan;
      if (exists) {
        nextPlan = prev.filter(p =>
          !((p.code && course.code && normalizeCode(p.code) === normalizeCode(course.code)) ||
            (p.id === course.id) ||
            (p.nameAr === course.nameAr))
        );
        toast.info(isAr ? `تمت إزالة ${course.nameAr}` : `Removed ${course.name}`);
      } else {
        if (prev.reduce((acc, c) => acc + c.hours, 0) + course.hours > maxHours) {
          toast.error(isAr ? "تجاوزت الحد الأقصى للساعات" : "Max hours exceeded");
          return prev;
        }
        nextPlan = [...prev, course];
        toast.success(isAr ? `تم اختيار ${nextPlan.length} مواد بنجاح` : `Successfully selected ${nextPlan.length} courses`);
      }
      return nextPlan;
    });
  };

  const handleAiMagic = async () => {
    if (activePlan.length === 0) {
      toast.error(isAr ? "الرجاء اختيار المواد أولاً" : "Please select courses first");
      return;
    }

    setIsGenerating(true);
    setAiSuggestions([]);
    toast.info(isAr ? "جاري إعادة جدولة المواد ذكياً..." : "Intelligently rescheduling...");

    try {
      const { getSmartScheduleRecommendations } = await import("../services/ai-integration");
      const res = await getSmartScheduleRecommendations(
        selectedMajor,
        selectedYear,
        selectedSemester,
        dbSections,
        activePlan,
        targetHours,
        aiIntent
      );

      if (res.success && res.suggestions) {
        setAiSuggestions(res.suggestions);
        toast.success(isAr ? "تم توليد عدة خيارات ذكية لموادك!" : "Generated multiple AI options for your courses!");
      } else {
        toast.error(isAr ? "تعذر توليد جدول ذكي حالياً" : "Could not generate AI schedule right now");
      }
    } catch (err) {
      console.error("AI Magic Error:", err);
      toast.error(isAr ? "فشل الاتصال بمحرك الذكاء الاصطناعي" : "Failed to connect to AI engine");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggested = (s: any) => {
    const sectionIds = s.section_ids || s.sectionIds;
    const selectedSections = dbSections.filter(sec => sectionIds.includes(sec.id));

    if (selectedSections.length === 0) {
      toast.error(isAr ? "هذا الجدول غير متاح حالياً" : "This schedule is not available currently");
      return;
    }

    const coursesToSelect = dbCourses.filter(c =>
      selectedSections.some(sec => sec.courseId === c.id)
    );

    setActivePlan(coursesToSelect);

    setIsGenerating(true);
    setGenerationStep('processing');
    const rawSchedules = [selectedSections];
    setIsGenerating(false);
    setGenerationStep('idle');

    const options: ScheduleOption[] = [{
      sections: selectedSections,
      totalHours: selectedSections.reduce((sum, s) => {
        const c = dbCourses.find(course => course.id === s.courseId);
        return sum + (c?.hours || 0);
      }, 0)
    }];

    setGeneratedSchedules(options);
    setCurrentOptionIndex(0);
    toast.success(isAr ? `تم تطبيق: ${s.title_ar || s.titleAr}` : `Applied: ${s.title_en || s.titleEn}`);
  };

  const handleGenerate = async () => {
    if (activePlan.length === 0) {
      toast.error(isAr ? "الرجاء اختيار المواد أولاً" : "Please select courses first");
      return;
    }

    const coursesWithNoSections = activePlan.filter(c => {
      const sections = dbSections.filter(s => s.courseId === c.id || s.courseId === c.code);
      return sections.length === 0;
    });

    if (coursesWithNoSections.length > 0) {
      const names = coursesWithNoSections.map(c => isAr ? c.nameAr : c.name).join(", ");
      toast.warning(isAr
        ? `المواد التالية لا يوجد لها شُعب في القاعدة: ${names}`
        : `No sections found for: ${names}`);
    }

    setIsGenerating(true);
    setGenerationStep('processing');
    setGeneratedSchedules([]);

    try {
      toast.info(isAr ? "جاري توليد جداول ذكية..." : "Generating smart schedules...");
      const { getSmartScheduleRecommendations } = await import("../services/ai-integration");
      const res = await getSmartScheduleRecommendations(
        selectedMajor,
        selectedYear,
        selectedSemester,
        dbSections,
        activePlan,
        targetHours,
        aiIntent
      );

      if (res.success && res.suggestions && res.suggestions.length > 0) {
        const options: ScheduleOption[] = res.suggestions.slice(0, 5).map((s: any) => {
          const sectionIds = s.section_ids || s.sectionIds;
          let selectedSections = dbSections.filter(sec => sectionIds.includes(sec.id));

          activePlan.forEach(planCourse => {
            const hasSection = selectedSections.some(sec =>
              (sec.courseId && planCourse.id && sec.courseId === planCourse.id) ||
              (sec.courseId && planCourse.code && normalizeCode(sec.courseId) === normalizeCode(planCourse.code)) ||
              (dbCourses.find(dc => dc.id === sec.courseId || (dc.code && normalizeCode(dc.code) === normalizeCode(sec.courseId)))?.nameAr === planCourse.nameAr)
            );

            if (!hasSection) {
              const fallbackSec = dbSections.find(sec =>
                (sec.courseId && planCourse.id && sec.courseId === planCourse.id) ||
                (sec.courseId && planCourse.code && normalizeCode(sec.courseId) === normalizeCode(planCourse.code)) ||
                (dbCourses.find(dc => dc.id === sec.courseId || (dc.code && normalizeCode(dc.code) === normalizeCode(sec.courseId)))?.nameAr === planCourse.nameAr)
              );
              if (fallbackSec) selectedSections.push(fallbackSec);
            }
          });

          const finalSections: Section[] = [];
          const seenCourseCodes = new Set<string>();

          selectedSections.forEach(sec => {
            const course = dbCourses.find(c => c.id === sec.courseId || (c.code && normalizeCode(c.code) === normalizeCode(sec.courseId)));
            const courseCode = course?.code || sec.courseId;
            const normalized = normalizeCode(courseCode);
            if (!seenCourseCodes.has(normalized)) {
              finalSections.push(sec);
              seenCourseCodes.add(normalized);
            }
          });

          return {
            sections: finalSections,
            totalHours: finalSections.reduce((sum, sec) => {
              const c = dbCourses.find(course => course.id === sec.courseId || (course.code && normalizeCode(course.code) === normalizeCode(sec.courseId)));
              return sum + (c?.hours || 0);
            }, 0),
            aiTitle: isAr ? s.titleAr : s.titleEn,
            aiDescription: isAr ? s.descriptionAr : s.descriptionEn
          };
        });

        setGeneratedSchedules(options);
        setCurrentOptionIndex(0);
        toast.success(isAr ? `تم توليد ${options.length} خيارات ذكية!` : `Generated ${options.length} smart options!`);
      } else {
        throw new Error("AI returned no results");
      }
    } catch (err) {
      console.warn("AI Generation failed, falling back to local engine:", err);
      toast.info(isAr ? "تم استخدام المحرك السريع" : "Using fast engine");
      const rawSchedules = runGenerator(activePlan, dbSections);

      if (rawSchedules.length === 0) {
        toast.error(isAr ? "تعذر العثور على جدول بدون تعارضات" : "No conflict-free schedules found");
      } else {
        const options: ScheduleOption[] = rawSchedules.slice(0, 7).map((opt, idx) => {
          let selectedSections = [...opt];

          activePlan.forEach(planCourse => {
            const hasSection = selectedSections.some(sec =>
              sec.courseId === planCourse.id ||
              sec.courseId === planCourse.code ||
              dbCourses.find(dc => dc.id === sec.courseId || dc.code === sec.courseId)?.nameAr === planCourse.nameAr
            );

            if (!hasSection) {
              const fallbackSec = dbSections.find(sec =>
                sec.courseId === planCourse.id ||
                sec.courseId === planCourse.code ||
                dbCourses.find(dc => dc.id === sec.courseId || dc.code === sec.courseId)?.nameAr === planCourse.nameAr
              );
              if (fallbackSec) selectedSections.push(fallbackSec);
            }
          });

          const finalSections: Section[] = [];
          const seenCourseCodes = new Set<string>();
          selectedSections.forEach(sec => {
            const course = dbCourses.find(c => c.id === sec.courseId || (c.code && normalizeCode(c.code) === normalizeCode(sec.courseId)));
            const courseCode = course?.code || sec.courseId;
            const normalized = normalizeCode(courseCode);
            if (!seenCourseCodes.has(normalized)) {
              finalSections.push(sec);
              seenCourseCodes.add(normalized);
            }
          });

          return {
            sections: finalSections,
            totalHours: finalSections.reduce((sum, s) => {
              const c = dbCourses.find(course => course.id === s.courseId || (course.code && normalizeCode(course.code) === normalizeCode(s.courseId)));
              return sum + (c?.hours || 0);
            }, 0),
            aiTitle: isAr ? `الخيار المتاح ${idx + 1}` : `Available Option ${idx + 1}`,
            aiDescription: isAr ? (finalSections.length < activePlan.length ? "تم توليد أفضل جدول ممكن مع تجاوز المواد المتعارضة." : "تم توليد هذا الجدول محلياً بنجاح.") : "Local fallback."
          };
        });
        setGeneratedSchedules(options);
        setCurrentOptionIndex(0);
        if (options[0].sections.length < activePlan.length) {
          toast.warning(isAr ? "بعض المواد لم يتم العثور على شعب لها" : "Some courses have no available sections");
        }
      }
    } finally {
      setIsGenerating(false);
      setGenerationStep('idle');
    }
  };

  const handleScreenshot = async () => {
    if (!scheduleRef.current) return;

    try {
      toast.info(isAr ? "جاري تجهيز الصورة..." : "Preparing image...");

      const html2canvas = (window as any).html2canvas;
      if (!html2canvas) {
        throw new Error("Screenshot library not loaded");
      }

      const canvas = await html2canvas(scheduleRef.current, {
        backgroundColor: "#050505",
        scale: 2,
        logging: false,
        useCORS: true
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Murshid-Schedule-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success(isAr ? "تم حفظ لقطة الشاشة بنجاح!" : "Screenshot saved successfully!");
    } catch (error) {
      console.error("Screenshot error:", error);
      toast.error(isAr ? "فشل التقاط الصورة" : "Failed to take screenshot");
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
    localStorage.setItem('my_schedule_last_updated', new Date().toISOString());

    if (user) {
      supabase.from('user_schedules').upsert({
        user_id: user.id,
        student_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
        student_email: user.email,
        schedule_data: itemsToSave,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' }).then(({ error }) => {
        if (!error) {
          toast.success(isAr ? "تمت المزامنة السحابية بنجاح" : "Cloud sync successful");
          navigate('/my-schedule');
        } else {
          console.error("Cloud sync error:", error);
          toast.error(isAr ? `فشلت المزامنة السحابية: ${error.message}` : `Cloud sync failed: ${error.message}`);
          navigate('/my-schedule');
        }
      });
    } else {
      toast.success(isAr ? "تم تصدير الجدول إلى 'جدولي'" : "Schedule exported to 'My Schedule'");
      navigate('/my-schedule');
    }
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
        instructor: s.instructorName || instr?.name,
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
    let filtered = dbCourses.filter(c =>
      c.nameAr.includes(searchQuery) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.filter(c =>
      dbSections.some(s => s.courseId === c.id || s.courseId === c.code || c.nameAr === (dbCourses.find(dc => dc.id === s.courseId || dc.code === s.courseId)?.nameAr)) &&
      !activePlan.find(ap => ap.id === c.id)
    );
  }, [searchQuery, activePlan, dbCourses, dbSections]);

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
        <div className="lg:col-span-3 xl:col-span-3 space-y-5 lg:order-1">
          <div className="p-6 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-border/50 shadow-elegant">
            <div className="space-y-5">
              <div className="space-y-3 pb-5 border-b border-border/10">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || isDataLoading}
                  className="w-full bg-accent text-accent-foreground rounded-2xl py-4 flex items-center justify-center gap-3 font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isAr ? "توليد الجدول" : "Generate Schedule"}
                </button>

                <div className="grid grid-cols-3 gap-1 p-1 bg-primary/5 rounded-xl border border-primary/10">
                  <button onClick={() => setAiIntent('relaxed')} className={cn("py-2 text-[10px] font-black rounded-lg transition-all", aiIntent === 'relaxed' ? "bg-primary text-white shadow-sm" : "text-primary/60 hover:bg-primary/5")}>{isAr ? "مريح" : "Relaxed"}</button>
                  <button onClick={() => setAiIntent('balanced')} className={cn("py-2 text-[10px] font-black rounded-lg transition-all", aiIntent === 'balanced' ? "bg-primary text-white shadow-sm" : "text-primary/60 hover:bg-primary/5")}>{isAr ? "متوازن" : "Balanced"}</button>
                  <button onClick={() => setAiIntent('compressed')} className={cn("py-2 text-[10px] font-black rounded-lg transition-all", aiIntent === 'compressed' ? "bg-primary text-white shadow-sm" : "text-primary/60 hover:bg-primary/5")}>{isAr ? "مكثف" : "Fast"}</button>
                </div>
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
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-border/50 shadow-elegant flex flex-col min-h-[500px] lg:max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
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

            {mode === "plan" && (
              <div className="flex-1 overflow-y-auto space-y-2.5 px-0.5 custom-scrollbar mb-4">
                {recommendedCourses.map(course => {
                  const isSelected = activePlan.some(p =>
                    (p.code && course.code && p.code === course.code) ||
                    (p.id === course.id) ||
                    (p.nameAr === course.nameAr)
                  );
                  return (
                    <button
                      key={course.id}
                      onClick={() => toggleCourse(course)}
                      className={cn(
                        "w-full p-3 text-right rounded-xl border transition-all flex items-center justify-between group",
                        isSelected
                          ? "bg-accent/15 border-accent shadow-sm"
                          : "bg-background/20 border-border/10 hover:border-accent/30"
                      )}
                    >
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center animate-in zoom-in duration-300">
                          <Check className="w-2.5 h-2.5 text-accent-foreground" />
                        </div>
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100" />
                      )}
                      <div className="flex flex-col items-end">
                        <span className={cn("text-[11px] font-black transition-colors", isSelected ? "text-accent" : "text-foreground")}>
                          {isAr ? course.nameAr : course.name}
                        </span>
                        <span className={cn("text-[9px] font-bold transition-colors", isSelected ? "text-accent/60" : "text-muted-foreground")}>
                          {course.code} • {course.hours}h
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

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
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute z-[100] w-full mt-2 bg-background border-2 border-accent/30 shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] rounded-2xl max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar"
                    >
                      {filteredSearch.map(c => (
                        <div key={c.id} className="w-full p-4 text-right hover:bg-accent/5 flex items-center justify-between group border-b border-white/5 last:border-0 transition-all">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { toggleCourse(c); setSearchQuery(""); }}
                              className="p-2.5 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-white transition-all shadow-md"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                            {isAdmin && (
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => navigate(`/admin?tab=courses&edit=${c.id}`)} className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteCourseFromDB(c.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-base font-black text-foreground">{isAr ? c.nameAr : c.name}</span>
                            <span className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider">{c.code} • {c.hours}h</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="mt-2">
              <div className="bg-background/40 border border-white/5 transition-all duration-500 group/box">
                <button
                  onClick={() => setIsSelectionReviewOpen(!isSelectionReviewOpen)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all relative border-b border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-accent/20 flex items-center justify-center border border-accent/30">
                      <ChevronRight className={cn("w-4 h-4 text-accent transition-transform", isSelectionReviewOpen && "rotate-90")} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-wider text-foreground/90 group-hover/box:text-accent transition-colors">{isAr ? "عرض المواد المختارة" : "View Selected"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-white/5 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${(activePlan.length / 7) * 100}%` }} className="h-full bg-accent" />
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {isSelectionReviewOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="overflow-y-auto custom-scrollbar">
                        {activePlan.map(course => {
                          const isInSchedule = generatedSchedules[currentOptionIndex]?.sections.some(s =>
                            (s.courseId && course.id && s.courseId === course.id) ||
                            (s.courseId && course.code && normalizeCode(s.courseId) === normalizeCode(course.code))
                          );
                          const hasConflict = findConflicts(generatedSchedules[currentOptionIndex]?.sections || []).some(c =>
                            (c.s1.courseId && course.id && c.s1.courseId === course.id) ||
                            (c.s1.courseId && course.code && normalizeCode(c.s1.courseId) === normalizeCode(course.code)) ||
                            (c.s2.courseId && course.id && c.s2.courseId === course.id) ||
                            (c.s2.courseId && course.code && normalizeCode(c.s2.courseId) === normalizeCode(course.code))
                          );
                          const hasAnySectionInDB = dbSections.some(s =>
                            (s.courseId && course.id && s.courseId === course.id) ||
                            (s.courseId && course.code && normalizeCode(s.courseId) === normalizeCode(course.code)) ||
                            (dbCourses.find(dc => dc.id === s.courseId || (dc.code && dc.code === s.courseId))?.nameAr === course.nameAr)
                          );
                          return (
                            <motion.div key={course.id} layout className="flex items-center justify-between p-4 bg-white/[0.02] border-b border-white/5 hover:bg-white/5 transition-all">
                              <div className="flex items-center gap-4">
                                <div className={cn("w-2 h-10", isInSchedule ? (hasConflict ? "bg-red-500" : "bg-green-500") : "bg-white/5")} />
                                <div className="flex flex-col">
                                  <span className="text-base font-black leading-none mb-2">{isAr ? course.nameAr : course.name}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest">{course.code}</span>
                                    {isInSchedule ? (
                                      <span className={cn("text-[10px] font-black uppercase tracking-tighter", hasConflict ? "text-red-500" : "text-green-400")}>
                                        {hasConflict ? (isAr ? "تعارض" : "Conflict") : (isAr ? "في الجدول" : "In Grid")}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-tighter">
                                        {hasAnySectionInDB ? (isAr ? "جاري التوليد" : "Syncing") : (isAr ? "غير متاح" : "Not Found")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button onClick={() => toggleCourse(course)} className="w-10 h-10 flex items-center justify-center text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-lg mr-2">
                                <X className="w-5 h-5" />
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/20 space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs sm:text-sm font-black text-muted-foreground uppercase tracking-tighter mb-1">{isAr ? "إجمالي الساعات" : "Total Hours"}</span>
                <span className="text-2xl sm:text-3xl font-black text-accent leading-none" dir="ltr">{totalHours} / {maxHours}h</span>
              </div>
              <div className="w-full bg-muted/10 rounded-full h-1 overflow-hidden">
                <motion.div animate={{ width: `${Math.min((totalHours / maxHours) * 100, 100)}%` }} className={cn("h-full rounded-full transition-all duration-500", totalHours > maxHours ? "bg-destructive" : "bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),0.3)]")} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 xl:col-span-9 space-y-4 lg:order-2">
          {generatedSchedules[currentOptionIndex] && findConflicts(generatedSchedules[currentOptionIndex].sections).length > 0 && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex flex-col">
                <span className="text-sm font-black text-red-500">{isAr ? "تنبيه: تضارب في المواعيد" : "Conflict Detected"}</span>
                <p className="text-xs font-bold text-red-500/70">
                  {isAr
                    ? `هناك تعارض بين: ${findConflicts(generatedSchedules[currentOptionIndex].sections).map(c =>
                      `${dbCourses.find(dc => dc.id === c.s1.courseId || dc.code === c.s1.courseId)?.nameAr} و ${dbCourses.find(dc => dc.id === c.s2.courseId || dc.code === c.s2.courseId)?.nameAr}`
                    ).join(" | ")}`
                    : "Some courses overlap in time."}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-5 bg-surface/50 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-elegant mb-6">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase text-accent mb-1.5">{isAr ? "الخيار الحالي" : "CURRENT OPTION"}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-background/50 border border-accent/20 rounded-2xl p-1.5">
                    <button onClick={() => setCurrentOptionIndex(prev => Math.max(0, prev - 1))} className="p-2 rounded-xl hover:bg-surface transition-all disabled:opacity-20 text-accent" disabled={currentOptionIndex === 0}><ChevronRight className="w-6 h-6" /></button>
                    <span className="text-lg font-black min-w-[4ch] text-center text-foreground">{currentOptionIndex + 1}/{Math.max(1, generatedSchedules.length)}</span>
                    <button onClick={() => setCurrentOptionIndex(prev => Math.min(generatedSchedules.length - 1, prev + 1))} className="p-2 rounded-xl hover:bg-surface transition-all disabled:opacity-20 text-accent" disabled={currentOptionIndex >= generatedSchedules.length - 1}><ChevronLeft className="w-6 h-6" /></button>
                  </div>
                </div>
              </div>
              {generatedSchedules[currentOptionIndex]?.aiTitle && (
                <div className="flex flex-col border-r border-border/20 pr-6 mr-2 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-6 rtl:mr-0 rtl:ml-2">
                  <span className="text-xs font-black uppercase text-primary leading-none mb-1.5">{generatedSchedules[currentOptionIndex].aiTitle}</span>
                  <p className="text-[11px] font-bold text-muted-foreground line-clamp-1 italic max-w-[400px]">"{generatedSchedules[currentOptionIndex].aiDescription}"</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center border-r border-border/20 pr-6 mr-4 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-6 rtl:mr-0 rtl:ml-4">
                <span className="text-xs font-black uppercase text-muted-foreground mb-1.5">{isAr ? "إجمالي الساعات" : "TOTAL HOURS"}</span>
                <span className="text-3xl font-black text-accent leading-none">{generatedSchedules[currentOptionIndex]?.totalHours || 0}</span>
              </div>
              <div className="flex items-center gap-2 p-1 bg-background/50 rounded-xl border border-border/20">
                <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:bg-surface")}><LayoutGrid className="w-5 h-5" /></button>
                <button onClick={() => setViewMode("table")} className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:bg-surface")}><Table2 className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleScreenshot} className="flex items-center justify-center w-12 h-12 bg-accent/10 text-accent rounded-full hover:bg-accent hover:text-accent-foreground transition-all shadow-md active:scale-95" title={isAr ? "لقطة شاشة" : "Screenshot"}><Camera className="w-6 h-6" /></button>
                <button onClick={handleDownload} className="flex items-center gap-2.5 px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-black hover:opacity-90 transition-all shadow-md active:scale-95"><Download className="w-5 h-5" />{isAr ? "حفظ وتصدير" : "Save & Export"}</button>
              </div>
            </div>
          </div>

          <div ref={scheduleRef} className="bg-surface/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-elegant overflow-hidden relative">
            <div className="overflow-auto max-h-[750px] custom-scrollbar relative z-10">
              {generatedSchedules.length > 0 ? (
                viewMode === "table" ? (
                  <div className="p-6 md:p-10 min-h-[500px]">
                    <div className="bg-[#f9f3d5] rounded-lg border-2 border-[#b0b0b0] shadow-md text-black font-sans relative overflow-hidden rtl:text-right">
                      <div className="bg-[#f9f3d5] p-6 border-b-2 border-[#c0c0c0] flex justify-between items-start">
                        <div className="w-32 flex justify-start"><img src="/logo-dark.svg" alt="Hadeed Logo" className="h-16 w-auto object-contain" /></div>
                        <div className="text-center">
                          <h2 className="text-2xl font-bold mb-1 tracking-wider text-[#222]">{isAr ? "مواعيد المحاضرات" : "Class Schedule"}</h2>
                          <div className="w-32 h-0.5 bg-[#888] mx-auto mt-2"></div>
                          <div className="w-24 h-0.5 bg-[#888] mx-auto mt-1"></div>
                        </div>
                        <div className="text-xs font-bold font-mono text-[#444] pt-2 whitespace-nowrap" dir="ltr">{new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(',', '')}</div>
                      </div>
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
                                <td className="border-b border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] py-4 px-6 text-center">{isAr ? item.courseNameAr : item.courseName}</td>
                                <td className="border-b border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] py-4 px-6 text-center leading-relaxed">
                                  <div className="mb-1">{isAr ? item.daysStrAr : item.daysStrEn}</div>
                                  <div className="text-xs text-[#555]">{item.startTime} - {item.endTime}</div>
                                </td>
                                <td className="border-b border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] py-4 px-6 text-center font-mono">{item.room}</td>
                                <td className="border-b border-[#c0c0c0] py-4 px-6 text-center">{isAr ? item.instructorAr : item.instructor}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative p-4" style={{ height: `${GRID_HEIGHT}px`, minWidth: "800px" }}>
                    <div className="absolute inset-0 grid grid-cols-5 ml-14 rtl:ml-0 rtl:mr-14">
                      {[...Array(5)].map((_, i) => (<div key={i} className="border-r border-border/5 last:border-0" />))}
                    </div>
                    <div className="absolute inset-0 mt-12 ml-14 rtl:ml-0 rtl:mr-14">
                      {TIME_SLOTS.map((_, i) => (<div key={i} className="border-b border-border/5" style={{ height: `${ROW_HEIGHT}px` }} />))}
                    </div>
                    <div className="relative h-full flex flex-col">
                      <div className="h-12 grid grid-cols-5 ml-14 rtl:ml-0 rtl:mr-14 border-b border-border/20">
                        {WEEKDAYS.map(day => (
                          <div key={day.id} className="flex items-center justify-center">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-muted-foreground/60">{isAr ? day.label : day.labelEn}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 relative flex">
                        <div className="w-14 flex flex-col border-l rtl:border-l-0 rtl:border-r border-border/20">
                          {TIME_SLOTS.map((hour) => (
                            <div key={hour} className="flex items-start justify-center pt-2" style={{ height: `${ROW_HEIGHT}px` }}>
                              <span className="text-xs font-black text-muted-foreground/30">{hour}:00</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 relative">
                          <AnimatePresence mode="popLayout">
                            {scheduleViews.gridItems.map((item, idx) => {
                              const duration = (item.endHour + (parseInt(item.endTime.split(':')[1]) / 60)) - (item.startHour + (parseInt(item.startTime.split(':')[1]) / 60));
                              const startOffset = (item.startHour - 8) + (parseInt(item.startTime.split(':')[1]) / 60);
                              const top = startOffset * ROW_HEIGHT;
                              const height = duration * ROW_HEIGHT;
                              const dayIndex = WEEKDAYS.findIndex(d => d.id === item.day);
                              return (
                                <motion.div key={`${item.courseId}-${item.day}-${idx}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="absolute p-1 overflow-hidden group cursor-pointer transition-all hover:z-10" style={{ top: `${top}px`, height: `${height}px`, width: "20%", [isAr ? 'right' : 'left']: `${dayIndex * 20}%` }}>
                                  <div className="h-full w-full rounded-2xl bg-accent/15 border-2 border-accent/30 shadow-md shadow-accent/[0.02] backdrop-blur-md p-3 flex flex-col justify-between group-hover:bg-accent/25 group-hover:border-accent/50 transition-all border-l-4 border-l-accent">
                                    <div className="space-y-0.5 text-right">
                                      <h4 className="text-xs font-black leading-tight text-foreground line-clamp-2">{isAr ? item.courseNameAr : item.courseName}</h4>
                                      <div className="flex items-center justify-end gap-1.5 opacity-50"><span className="text-[10px] font-bold">{isAr ? item.instructorAr : item.instructor}</span><User className="w-3 h-3" /></div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                      <div className="flex items-center gap-1 text-[10px] font-black bg-surface/80 px-1.5 py-0.5 rounded-lg border border-border/20"><MapPin className="w-3 h-3 text-accent" /><span>{item.room}</span></div>
                                      <div className="flex items-center gap-1 text-[10px] font-black text-accent"><Clock className="w-3 h-3" /><span>{item.startTime}</span></div>
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
                    <p className="text-sm font-bold text-muted-foreground max-w-sm mx-auto">{isAr ? "بعد اختيار موادك وضبط الإعدادات، سيقوم الذكاء الاصطناعي برسم جدولك في هذه المساحة الواسعة." : "After selecting your courses and settings, AI will render your optimized schedule in this wide space."}</p>
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
