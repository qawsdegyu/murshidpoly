import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Scale, BookOpen, Search, Sparkles, Filter, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, Check, AlertTriangle, Download, Trash2, Plus,
  Settings2, Layers, Info, Maximize2, Minimize2, Loader2, Table2, LayoutGrid, Edit, AlertCircle, X, Layout, Camera, ChevronDown
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
import { scheduleApi } from "../services/schedule-api";
import PageHeader from "../components/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";

const WEEKDAYS = [
  { id: 0, label: "الأحد", labelEn: "Sunday", key: "sunday" },
  { id: 1, label: "الاثنين", labelEn: "Monday", key: "monday" },
  { id: 2, label: "الثلاثاء", labelEn: "Tuesday", key: "tuesday" },
  { id: 3, label: "الأربعاء", labelEn: "Wednesday", key: "wednesday" },
  { id: 4, label: "الخميس", labelEn: "Thursday", key: "thursday" },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [gridScale, setGridScale] = useState(1); // 1 to 1.5
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [activeDayIndex, setActiveDayIndex] = useState(0); // For mobile grid view

  // Data State
  const [activePlan, setActivePlan] = useState<Course[]>([]);
  const [generatedSchedules, setGeneratedSchedules] = useState<ScheduleOption[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'least-days' | 'earliest-end' | 'least-conflict'>('default');
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0);
  const [aiIntent, setAiIntent] = useState<'balanced' | 'relaxed' | 'compressed'>('balanced');
  const [maxStudyDays, setMaxStudyDays] = useState<number>(5);
  const [minStartTime, setMinStartTime] = useState<string>("08:00");
  const [avoidTeachers, setAvoidTeachers] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<{ day: number, start: string, end: string }[]>([]);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // Database State
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [dbSections, setDbSections] = useState<Section[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'processing' | 'optimizing'>('idle');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  const loadingSteps = [
    { pct: 20, msg: isAr ? "جاري تحليل موادك المختارة..." : "Analyzing selected courses..." },
    { pct: 45, msg: isAr ? "جاري البحث عن توافق الأوقات..." : "Finding time compatibility..." },
    { pct: 70, msg: isAr ? "جاري تنويع المدرسين والأوقات..." : "Diversifying instructors and times..." },
    { pct: 90, msg: isAr ? "جاري اللمسات النهائية للذكاء الاصطناعي..." : "Finalizing AI optimization..." },
    { pct: 100, msg: isAr ? "تم! الخيارات جاهزة" : "Ready!" },
  ];

  useEffect(() => {
    async function fetchData() {
      setIsDataLoading(true);
      try {
        const [courses, sections] = await Promise.all([
          scheduleApi.getCourses(),
          scheduleApi.getSections(semesterType === "summer" ? '2024-2025-summer' : '2024-2025-regular')
        ]);

        setDbCourses(courses);
        setDbSections(sections);
      } catch (err) {
        console.error("Error fetching schedule data:", err);
        toast.error(isAr ? "فشل تحميل البيانات من السيرفر" : "Failed to load data from server");
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchData();
  }, [semesterType]);

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

  // Derive level
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

    // Show ALL courses that have at least one section in the current DB (newspaper)
    // This allows students to find electives or courses outside their roadmap if needed
    const allAvailable = dbCourses.filter(c => {
      return dbSections.some(s => s.courseId === c.id || s.courseId === c.code);
    });

    // Sort: Roadmap courses first, then others alphabetically
    return allAvailable.sort((a, b) => {
      const aInRoadmap = roadmapForMajor.some(rn =>
        rn.id === a.id || rn.id === a.code || rn.fallbackNameAr === a.nameAr || rn.fallbackName === a.name
      );
      const bInRoadmap = roadmapForMajor.some(rn =>
        rn.id === b.id || rn.id === b.code || rn.fallbackNameAr === b.nameAr || rn.fallbackName === b.name
      );

      if (aInRoadmap && !bInRoadmap) return -1;
      if (!aInRoadmap && bInRoadmap) return 1;
      return (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name);
    });
  }, [selectedMajor, dbCourses, dbSections, isDataLoading, targetCategoryMemo, isAr]);



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
      // Triple-match logic for absolute reliability (using normalized code)
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
      // Update: Passing specific selected courses to the AI
      const res = await getSmartScheduleRecommendations(
        selectedMajor,
        selectedYear,
        selectedSemester,
        dbSections,
        activePlan, // Pass the user's selected courses here
        targetHours,
        aiIntent,
        recommendedCourses
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

    // Auto generate the actual schedule view
    setIsGenerating(true);
    setGenerationStep('processing');
    const rawSchedules = [selectedSections]; // Directly use the suggested sections
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

    // Diagnostic: Check for courses with NO sections
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
    
    // Start Progressive Loading Simulation
    let stepIdx = 0;
    const progressInterval = setInterval(() => {
      if (stepIdx < loadingSteps.length) {
        setLoadingProgress(loadingSteps[stepIdx].pct);
        setLoadingMessage(loadingSteps[stepIdx].msg);
        stepIdx++;
      } else {
        clearInterval(progressInterval);
      }
    }, 800);

    try {
      const { getSmartScheduleRecommendations } = await import("../services/ai-integration");
      const res = await getSmartScheduleRecommendations(
        selectedMajor,
        selectedYear,
        selectedSemester,
        dbSections,
        activePlan,
        targetHours,
        aiIntent,
        recommendedCourses,
        avoidTeachers,
        blockedSlots,
        maxStudyDays,
        minStartTime
      );

      clearInterval(progressInterval); // Clear in case it finished early

      if (res.success && res.suggestions && res.suggestions.length > 0) {
        const options: ScheduleOption[] = res.suggestions.slice(0, 12).map((s: any) => {
          const sectionIds = s.section_ids || s.sectionIds;

          // 1. Get sections recommended by AI
          let selectedSections = dbSections.filter(sec => sectionIds.includes(sec.id));

          // 2. MANDATORY SYNC: Ensure EVERY course in activePlan has a section
          // DIVERSITY UPDATE: Shuffle potential fallbacks to avoid repeating the same instructor
          activePlan.forEach(planCourse => {
            const hasSection = selectedSections.some(sec =>
              (sec.courseId && planCourse.id && sec.courseId === planCourse.id) ||
              (sec.courseId && planCourse.code && normalizeCode(sec.courseId) === normalizeCode(planCourse.code)) ||
              (dbCourses.find(dc => dc.id === sec.courseId || (dc.code && normalizeCode(dc.code) === normalizeCode(sec.courseId)))?.nameAr === planCourse.nameAr)
            );

            if (!hasSection) {
              let potentialFallbacks = dbSections.filter(sec =>
                (sec.courseId && planCourse.id && sec.courseId === planCourse.id) ||
                (sec.courseId && planCourse.code && normalizeCode(sec.courseId) === normalizeCode(planCourse.code)) ||
                (dbCourses.find(dc => dc.id === sec.courseId || (dc.code && normalizeCode(dc.code) === normalizeCode(sec.courseId)))?.nameAr === planCourse.nameAr)
              );
              
              if (potentialFallbacks.length > 0) {
                // Shuffle fallbacks based on suggestion index to ensure diversity across the 12 options
                const shuffledFallbacks = [...potentialFallbacks].sort(() => Math.random() - 0.5);
                selectedSections.push(shuffledFallbacks[0]);
              }
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
            aiDescription: isAr ? s.descriptionAr : s.descriptionEn,
            isAI: true
          };
        });

        // Final Diversity Overhaul: Ensure all 12 options are unique and rotate sections
        const finalOptions: ScheduleOption[] = [];
        const globalUsedSectionSets = new Set<string>();

        options.forEach((opt, optIdx) => {
          let currentSections = [...opt.sections];
          
          // Rotation Logic: If this course has multiple sections, try to pick a different one 
          // to avoid repeating the same instructor across multiple options.
          currentSections = currentSections.map(sec => {
            const potentialOthers = dbSections.filter(s => 
              (s.courseId === sec.courseId) && s.id !== sec.id
            );
            
            // Randomly rotate for variety in options 2-12
            if (potentialOthers.length > 0 && optIdx > 0 && Math.random() > 0.5) {
              return potentialOthers[Math.floor(Math.random() * potentialOthers.length)];
            }
            return sec;
          });

          const hash = currentSections.map(s => s.id).sort().join(',');
          if (!globalUsedSectionSets.has(hash)) {
            finalOptions.push({ ...opt, sections: currentSections });
            globalUsedSectionSets.add(hash);
          }
        });

        setGeneratedSchedules(finalOptions.slice(0, 12));
        setCurrentOptionIndex(0);
        toast.success(isAr ? `تم توليد ${Math.min(finalOptions.length, 12)} خياراً متنوعاً!` : `Generated ${Math.min(finalOptions.length, 12)} diverse options!`);
      } else {
        throw new Error("AI returned no results");
      }
    } catch (err) {
      console.warn("AI Generation failed, falling back to local engine:", err);
      toast.info(isAr ? "تم استخدام المحرك السريع" : "Using fast engine");
      const rawSchedules = runGenerator(activePlan, dbSections, 12, avoidTeachers, blockedSlots, maxStudyDays, minStartTime);

      if (rawSchedules.length === 0) {
        toast.error(isAr ? "تعذر العثور على جدول بدون تعارضات" : "No conflict-free schedules found");
      } else {
        const options: ScheduleOption[] = rawSchedules.slice(0, 12).map((opt, idx) => {
          let selectedSections = [...opt];

          activePlan.forEach(planCourse => {
            const hasSection = selectedSections.some(sec =>
              sec.courseId === planCourse.id ||
              sec.courseId === planCourse.code ||
              dbCourses.find(dc => dc.id === sec.courseId || dc.code === sec.id || dc.code === sec.courseId)?.nameAr === planCourse.nameAr
            );

            if (!hasSection) {
              const potentialFallbacks = dbSections.filter(sec =>
                sec.courseId === planCourse.id ||
                sec.courseId === planCourse.code ||
                dbCourses.find(dc => dc.id === sec.courseId || dc.code === sec.id || dc.code === sec.courseId)?.nameAr === planCourse.nameAr
              );
              
              if (potentialFallbacks.length > 0) {
                const randomFallback = potentialFallbacks[Math.floor(Math.random() * potentialFallbacks.length)];
                selectedSections.push(randomFallback);
              }
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
            aiDescription: isAr ? (finalSections.length < activePlan.length ? "تم توليد أفضل جدول ممكن مع تجاوز المواد المتعارضة." : "تم توليد هذا الجدول محلياً بنجاح.") : "Local fallback.",
            isAI: false
          };
        });
        setGeneratedSchedules(options);
        setCurrentOptionIndex(0);
      }
    } finally {
      setIsGenerating(false);
      setGenerationStep('idle');
      setLoadingProgress(0);
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
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        onclone: (clonedDoc: Document) => {
          // No modifications needed on clone
        }
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

  const handleExportICS = () => {
    const option = sortedSchedules[currentOptionIndex];
    if (!option) return;

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Murshid Hub//Schedule Planner//EN\n";
    
    option.sections.forEach(sec => {
      const course = dbCourses.find(c => c.id === sec.courseId || c.code === sec.courseId);
      const courseName = isAr ? (course?.nameAr || sec.courseId) : (course?.name || sec.courseId);
      
      sec.days.forEach(dayIndex => {
        // SU, MO, TU, WE, TH
        const dayCodes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:${courseName}\n`;
        icsContent += `DESCRIPTION:Instructor: ${sec.instructorName || ''}\n`;
        icsContent += `LOCATION:${sec.room}\n`;
        icsContent += `RRULE:FREQ=WEEKLY;BYDAY=${dayCodes[dayIndex]}\n`;
        // Hardcoded start date for the events (May 2026)
        icsContent += `DTSTART:20260517T${sec.startTime.replace(':', '')}00\n`;
        icsContent += `DTEND:20260517T${sec.endTime.replace(':', '')}00\n`;
        icsContent += "END:VEVENT\n";
      });
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Murshid_Schedule_${currentOptionIndex + 1}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(isAr ? "تم تصدير ملف التقويم!" : "Calendar file exported!");
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

    // Cloud Sync
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
          toast.error(isAr
            ? `فشلت المزامنة السحابية: ${error.message}`
            : `Cloud sync failed: ${error.message}`
          );
          navigate('/my-schedule');
        }
      });
    } else {
      toast.success(isAr ? "تم تصدير الجدول إلى 'جدولي'" : "Schedule exported to 'My Schedule'");
      navigate('/my-schedule');
    }
  };

  const sortedSchedules = useMemo(() => {
    if (generatedSchedules.length === 0) return [];
    
    return [...generatedSchedules].sort((a, b) => {
      if (sortBy === 'least-days') {
        const daysA = new Set(a.sections.flatMap(s => s.days)).size;
        const daysB = new Set(b.sections.flatMap(s => s.days)).size;
        return daysA - daysB;
      }
      if (sortBy === 'earliest-end') {
        const getLatest = (opt: ScheduleOption) => Math.max(...opt.sections.map(s => {
          const [h, m] = s.endTime.split(':').map(Number);
          return h * 60 + m;
        }));
        return getLatest(a) - getLatest(b);
      }
      if (sortBy === 'least-conflict') {
        return findConflicts(a.sections).length - findConflicts(b.sections).length;
      }
      return 0; // default
    });
  }, [generatedSchedules, sortBy]);

  const scheduleViews = useMemo(() => {
    const option = sortedSchedules[currentOptionIndex];
    if (!option) return { gridItems: [], tableItems: [] };

    const gridItems: any[] = [];
    const tableItems: any[] = [];

    const dayMap: Record<number, number> = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4
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
    // 1. Filter by search query
    let filtered = dbCourses.filter(c =>
      c.nameAr.includes(searchQuery) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. ONLY show courses that have at least one section in the database
    return filtered.filter(c =>
      dbSections.some(s => s.courseId === c.id || s.courseId === c.code || c.nameAr === (dbCourses.find(dc => dc.id === s.courseId || dc.code === s.courseId)?.nameAr)) &&
      !activePlan.find(ap => ap.id === c.id)
    );
  }, [searchQuery, activePlan, dbCourses, dbSections]);

  const scheduleMetrics = useMemo(() => {
    const option = sortedSchedules[currentOptionIndex];
    if (!option) return null;

    const daysSet = new Set<number>();
    let earliestMinutes = 24 * 60;

    option.sections.forEach(s => {
      s.days.forEach(d => daysSet.add(d));
      const [h, m] = s.startTime.split(':').map(Number);
      const totalMin = h * 60 + m;
      if (totalMin < earliestMinutes) earliestMinutes = totalMin;
    });

    const h = Math.floor(earliestMinutes / 60);
    const m = earliestMinutes % 60;
    const earliestStr = `${h}:${m === 0 ? '00' : m}`;

    return {
      daysCount: daysSet.size,
      earliestTime: earliestStr,
      totalHours: option.totalHours,
      isAI: option.isAI
    };
  }, [generatedSchedules, currentOptionIndex]);

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
            <div className="space-y-6">
              {/* 1. Hours Configuration - NOW AT TOP */}
              <div className="space-y-4 pb-5 border-b border-white/5">
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{isAr ? "الساعات المستهدفة" : "Target Hours"}</span>
                    <span className="text-3xl font-black text-foreground leading-none">{targetHours}<span className="text-sm text-muted-foreground ml-1">h</span></span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{isAr ? "المختارة حالياً" : "Selected"}</span>
                    <span className={cn("text-xl font-black leading-none", totalHours > maxHours ? "text-red-500" : "text-foreground")}>{totalHours} / {maxHours}h</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="range"
                    min="9"
                    max={maxHours}
                    step="1"
                    value={targetHours}
                    onChange={(e) => setTargetHours(Number(e.target.value))}
                    className="w-full accent-secondary h-1.5 bg-white/10 rounded-full cursor-pointer appearance-none"
                  />
                  <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                    <motion.div
                      animate={{ width: `${Math.min((totalHours / maxHours) * 100, 100)}%` }}
                      className={cn("h-full rounded-full transition-all duration-500", totalHours > maxHours ? "bg-red-500" : "bg-secondary shadow-[0_0_15px_rgba(0,242,255,0.5)]")}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Generation Control */}
              <div className="space-y-3 pb-5 border-b border-white/5">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || isDataLoading}
                  className="w-full bg-secondary text-secondary-foreground rounded-2xl py-4 flex items-center justify-center gap-3 font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isAr ? "توليد جداول مقترحة" : "Generate Options"}
                </button>

                <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
                  <button onClick={() => setAiIntent('relaxed')} className={cn("py-2.5 text-xs font-black rounded-lg transition-all", aiIntent === 'relaxed' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-white/5")}>{isAr ? "مريح" : "Relaxed"}</button>
                  <button onClick={() => setAiIntent('balanced')} className={cn("py-2.5 text-xs font-black rounded-lg transition-all", aiIntent === 'balanced' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-white/5")}>{isAr ? "متوازن" : "Balanced"}</button>
                  <button onClick={() => setAiIntent('compressed')} className={cn("py-2.5 text-xs font-black rounded-lg transition-all", aiIntent === 'compressed' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-white/5")}>{isAr ? "مكثف" : "Fast"}</button>
                </div>

                {/* New Prominent Preferences */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">{isAr ? "أيام الدوام" : "STUDY DAYS"}</label>
                    <select 
                      value={maxStudyDays}
                      onChange={(e) => setMaxStudyDays(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-black outline-none focus:border-secondary/50 text-foreground"
                    >
                      <option value={5} className="text-black">{isAr ? "5 أيام (كامل)" : "5 Days (Full)"}</option>
                      <option value={4} className="text-black">{isAr ? "4 أيام" : "4 Days"}</option>
                      <option value={3} className="text-black">{isAr ? "3 أيام" : "3 Days"}</option>
                      <option value={2} className="text-black">{isAr ? "يومين" : "2 Days"}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">{isAr ? "أبكر موعد" : "EARLIEST START"}</label>
                    <select 
                      value={minStartTime}
                      onChange={(e) => setMinStartTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-black outline-none focus:border-secondary/50 text-foreground"
                    >
                      <option value="08:00" className="text-black">08:00 AM</option>
                      <option value="09:00" className="text-black">09:00 AM</option>
                      <option value="10:00" className="text-black">10:00 AM</option>
                      <option value="11:00" className="text-black">11:00 AM</option>
                      <option value="12:00" className="text-black">12:00 PM</option>
                      <option value="13:00" className="text-black">01:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Major Information */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">{isAr ? "التخصص المعتمد" : "Selected Major"}</label>
                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between group">
                  <span className="text-sm font-black text-secondary/80">
                    {majors.find(m => m.id === selectedMajor)?.[isAr ? 'nameAr' : 'name'] || selectedMajor}
                  </span>
                  <button
                    onClick={() => navigate('/settings')}
                    className="text-[10px] font-black text-muted-foreground hover:text-secondary underline transition-colors"
                  >
                    {isAr ? "تغيير" : "Change"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-border/50 shadow-elegant flex flex-col min-h-[500px] lg:max-h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                <h3 className="text-base font-black uppercase tracking-widest text-foreground">{isAr ? "الخطة الدراسية" : "Academic Plan"}</h3>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="overflow-y-auto space-y-2.5 px-0.5 custom-scrollbar mb-4 flex-1">
                {recommendedCourses.length > 0 ? (
                  recommendedCourses
                    .filter(course =>
                      !searchQuery ||
                      course.nameAr.includes(searchQuery) ||
                      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      course.code.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(course => {
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
                              ? "bg-secondary/15 border-secondary shadow-sm"
                              : "bg-background/20 border-border/10 hover:border-secondary/30"
                          )}
                        >
                          {isSelected ? (
                            <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center animate-in zoom-in duration-300">
                              <Check className="w-2.5 h-2.5 text-secondary-foreground" />
                            </div>
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-secondary opacity-0 group-hover:opacity-100" />
                          )}
                          <div className="flex flex-col items-end">
                            <span className={cn("text-base sm:text-lg font-black transition-colors", isSelected ? "text-secondary" : "text-foreground")}>
                              {isAr ? course.nameAr : course.name}
                            </span>
                            <span className={cn("text-sm font-bold transition-colors", isSelected ? "text-secondary/60" : "text-muted-foreground")}>
                              {course.code} • {course.hours}h
                            </span>
                          </div>
                        </button>
                      );
                    })
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-xs font-bold">{isAr ? "جاري تحميل المواد..." : "Loading courses..."}</p>
                  </div>
                )}
              </div>

              {/* Search Bar at the bottom of the list */}
              <div className="relative mt-2 pt-4 border-t border-white/5">
                <Search className="absolute right-3 top-[calc(1rem+50%)] -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={isAr ? "بحث في مواد الخطة والجريدة..." : "Search plan and sections..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background/40 border border-border/20 rounded-xl text-sm font-bold py-3 pr-10 pl-3 outline-none focus:border-secondary/50 transition-all"
                />
              </div>
            </div>

            {/* Unified Expanding Selection Review Box */}
            <div className="mt-2">
              <div className="bg-background/40 border border-white/5 transition-all duration-500 group/box">
                <button
                  onClick={() => setIsSelectionReviewOpen(!isSelectionReviewOpen)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all relative border-b border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-secondary/20 flex items-center justify-center border border-secondary/30">
                      <ChevronRight className={cn("w-4 h-4 text-secondary transition-transform", isSelectionReviewOpen && "rotate-90")} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-wider text-foreground/90 group-hover/box:text-secondary transition-colors">
                      {isAr ? "عرض المواد المختارة" : "View Selected"}
                      <span className="ml-2 bg-secondary/10 text-secondary px-2 py-0.5 rounded-md text-[10px]">{activePlan.length}</span>
                    </span>
                  </div>

                  {/* Subtle Indicator */}
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 bg-white/5 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${(activePlan.length / 7) * 100}%` }} className="h-full bg-secondary" />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isSelectionReviewOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
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
                            <motion.div
                              key={course.id}
                              layout
                              className="flex items-center justify-between p-4 bg-white/[0.02] border-b border-white/5 hover:bg-white/5 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-2 h-10",
                                  isInSchedule ? (hasConflict ? "bg-red-500" : "bg-green-500") : "bg-white/5"
                                )} />
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

                              <button
                                onClick={() => toggleCourse(course)}
                                className="w-10 h-10 flex items-center justify-center text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-lg mr-2"
                              >
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

            {/* Advanced Preferences Card */}
            <div className="bg-surface/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-elegant overflow-hidden">
              <button 
                onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Settings2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-black text-foreground">{isAr ? "تفضيلات متقدمة" : "Advanced Preferences"}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {avoidTeachers.length > 0 || blockedSlots.length > 0 
                        ? (isAr ? `${avoidTeachers.length + blockedSlots.length} قيود` : `${avoidTeachers.length + blockedSlots.length} constraints`)
                        : (isAr ? "بدون قيود" : "No constraints")}
                    </span>
                  </div>
                </div>
                <ChevronDown className={cn("w-6 h-6 text-muted-foreground transition-all", isPreferencesOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isPreferencesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-white/5 space-y-6">
                      <div className="space-y-3">
                        <span className="text-xs font-black text-secondary uppercase tracking-widest">{isAr ? "تجنب مدرسين" : "AVOID TEACHERS"}</span>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(dbSections.map(s => s.instructorName))).filter(Boolean).slice(0, 12).map(teacher => (
                            <button
                              key={teacher}
                              onClick={() => setAvoidTeachers(prev => prev.includes(teacher!) ? prev.filter(t => t !== teacher) : [...prev, teacher!])}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-[9px] font-black border transition-all",
                                avoidTeachers.includes(teacher!) ? "bg-red-500/20 border-red-500/50 text-red-500" : "bg-white/5 border-white/10 text-muted-foreground"
                              )}
                            >
                              {teacher}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-xs font-black text-secondary uppercase tracking-widest">{isAr ? "أوقات محظورة" : "BLOCKED SLOTS"}</span>
                        <div className="flex flex-col gap-3">
                          <select 
                            className="bg-slate-800/50 border border-white/10 rounded-xl p-2 text-[10px] font-black outline-none text-foreground"
                            onChange={(e) => {
                              const day = parseInt(e.target.value);
                              if (day !== -1) setBlockedSlots(prev => [...prev, { day, start: "08:00", end: "10:00" }]);
                            }}
                            value="-1"
                          >
                            <option value="-1">{isAr ? "+ إضافة وقت..." : "+ Add time..."}</option>
                            {WEEKDAYS.map(d => <option key={d.id} value={d.id} className="text-black">{isAr ? d.label : d.labelEn}</option>)}
                          </select>
                          <div className="flex flex-wrap gap-2">
                            {blockedSlots.map((slot, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-xl px-2 py-1">
                                <span className="text-[9px] font-black text-secondary">
                                  {isAr ? WEEKDAYS.find(d => d.id === slot.day)?.label : WEEKDAYS.find(d => d.id === slot.day)?.labelEn}
                                </span>
                                <button onClick={() => setBlockedSlots(prev => prev.filter((_, i) => i !== idx))}><X className="w-3 h-3 text-secondary/50" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Main Schedule Grid */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-4 lg:order-2">
          {/* Conflict Warning */}
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

          <div className="flex items-center justify-between p-5 bg-surface/50 backdrop-blur-xl border border-border/50 rounded-[2rem] shadow-elegant mb-6 relative overflow-hidden">
            {/* Background Gradient for AI Source */}
            {generatedSchedules[currentOptionIndex]?.isAI && (
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none" />
            )}

            <div className="flex items-center gap-6 relative z-10">
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase text-secondary mb-1.5 flex items-center gap-2">
                  {isAr ? "الخيار الحالي" : "CURRENT OPTION"}
                  {generatedSchedules[currentOptionIndex] && (
                    <span className={cn(
                      "text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest border",
                      generatedSchedules[currentOptionIndex].isAI 
                        ? "bg-secondary/10 border-secondary/30 text-secondary" 
                        : "bg-primary/10 border-primary/30 text-primary"
                    )}>
                      {generatedSchedules[currentOptionIndex].isAI ? (isAr ? "✨ ذكاء اصطناعي" : "AI ENGINE") : (isAr ? "⚡ توليد سريع" : "LOCAL ENGINE")}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-background/50 border border-secondary/20 rounded-2xl p-1.5">
                    <button
                      onClick={() => setCurrentOptionIndex(prev => Math.max(0, prev - 1))}
                      className="p-2 rounded-xl hover:bg-surface transition-all disabled:opacity-20 text-secondary"
                      disabled={currentOptionIndex === 0}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-black min-w-[4ch] text-center text-foreground">
                      {currentOptionIndex + 1}/{Math.max(1, sortedSchedules.length)}
                    </span>
                    <button
                      onClick={() => setCurrentOptionIndex(prev => Math.min(sortedSchedules.length - 1, prev + 1))}
                      className="p-2 rounded-xl hover:bg-surface transition-all disabled:opacity-20 text-secondary"
                      disabled={currentOptionIndex >= sortedSchedules.length - 1}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  {sortedSchedules.length > 1 && (
                    <div className="flex flex-col ml-4 rtl:ml-0 rtl:mr-4">
                      <span className="text-[8px] font-black text-muted-foreground uppercase mb-1">{isAr ? "ترتيب حسب" : "SORT BY"}</span>
                      <select 
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value as any);
                          setCurrentOptionIndex(0);
                        }}
                        className="bg-slate-800/80 border border-white/10 rounded-xl text-[11px] font-black py-2 px-3 outline-none focus:border-secondary/50 text-foreground cursor-pointer"
                      >
                        <option value="default">{isAr ? "الافتراضي" : "Default"}</option>
                        <option value="least-days">{isAr ? "أقل أيام دوام" : "Least Days"}</option>
                        <option value="earliest-end">{isAr ? "أبكر انتهاء" : "Earliest End"}</option>
                        <option value="least-conflict">{isAr ? "أقل تعارض" : "Least Conflict"}</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {sortedSchedules[currentOptionIndex]?.aiTitle && (
                <div className="flex flex-col border-r border-border/20 pr-6 mr-2 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-6 rtl:mr-0 rtl:ml-2">
                  <span className="text-xs font-black uppercase text-primary leading-none mb-1.5">{sortedSchedules[currentOptionIndex].aiTitle}</span>
                  <p className="text-[11px] font-bold text-muted-foreground line-clamp-1 italic max-w-[400px]">
                    "{sortedSchedules[currentOptionIndex].aiDescription}"
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="flex items-center gap-2 p-1 bg-background/50 rounded-xl border border-border/20">
                <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:bg-surface")}><LayoutGrid className="w-5 h-5" /></button>
                <button onClick={() => setViewMode("table")} className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:bg-surface")}><Table2 className="w-5 h-5" /></button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleScreenshot}
                  className="flex items-center justify-center w-12 h-12 bg-secondary/10 text-secondary rounded-full hover:bg-secondary hover:text-secondary-foreground transition-all shadow-md active:scale-95"
                  title={isAr ? "لقطة شاشة" : "Screenshot"}
                >
                  <Camera className="w-6 h-6" />
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2.5 px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-black hover:opacity-90 transition-all shadow-md active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  {isAr ? "تصدير الى جدولي" : "Export to My Schedule"}
                </button>
              </div>
            </div>
          </div>

          <div ref={scheduleRef} className="premium-mesh-bg border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative min-h-[500px] group/schedule">
            {/* Loading Overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center"
                >
                  <div className="w-20 h-20 relative mb-8">
                    <div className="absolute inset-0 border-4 border-secondary/20 rounded-full" />
                    <motion.div 
                      className="absolute inset-0 border-4 border-t-secondary rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-secondary animate-pulse" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-foreground mb-2">{isAr ? "جاري تحضير جدولك المثالي" : "Preparing Your Perfect Schedule"}</h3>
                  <p className="text-muted-foreground font-bold mb-8 max-w-xs">{loadingMessage}</p>
                  
                  <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      className="h-full bg-secondary shadow-[0_0_15px_rgba(0,242,255,0.5)]"
                      animate={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <span className="mt-2 text-xs font-black text-secondary/60 tracking-widest">{loadingProgress}%</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 p-4 sm:p-10 overflow-auto max-h-[850px] custom-scrollbar">
              {sortedSchedules.length > 0 ? (
                viewMode === "table" ? (
                  <div className="p-2 md:p-6 min-h-[500px]">
                    <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                      {/* Modern Header */}
                      <div className="p-10 border-b border-white/10 bg-gradient-to-r from-secondary/15 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-right">
                          <h2 className="text-4xl font-black tracking-tighter text-foreground">
                            {isAr ? "مواعيد المحاضرات" : "Class Schedule"}
                          </h2>
                          <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">
                              {new Date().toLocaleDateString(isAr ? 'ar-JO' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-3xl font-black text-secondary tracking-tighter">مرشد</span>
                            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-2xl shadow-secondary/30">
                              <Sparkles className="w-7 h-7 text-secondary-foreground" />
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">Engineering Hub</span>
                        </div>
                      </div>

                      {/* Modern Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-white/[0.05]">
                              <th className="px-10 py-7 text-right text-[11px] font-black text-secondary uppercase tracking-[0.2em] border-b border-white/10">{isAr ? "اسم المادة" : "Course"}</th>
                              <th className="px-10 py-7 text-right text-[11px] font-black text-secondary uppercase tracking-[0.2em] border-b border-white/10">{isAr ? "موعد المحاضرة" : "Schedule"}</th>
                              <th className="px-10 py-7 text-right text-[11px] font-black text-secondary uppercase tracking-[0.2em] border-b border-white/10">{isAr ? "القاعة" : "Location"}</th>
                              <th className="px-10 py-7 text-right text-[11px] font-black text-secondary uppercase tracking-[0.2em] border-b border-white/10">{isAr ? "المدرس" : "Professor"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {scheduleViews.tableItems.map((item, idx) => (
                              <tr key={idx} className="group/row hover:bg-white/[0.03] transition-all duration-500">
                                <td className="px-10 py-8 text-right">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-base font-black text-foreground group-hover/row:text-secondary transition-colors duration-500">{isAr ? item.courseNameAr : item.courseName}</span>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">{item.courseId || item.code}</span>
                                  </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 justify-end">
                                      <Calendar className="w-3.5 h-3.5 text-secondary/70" />
                                      <span className="text-xs font-black text-foreground/90">{item.daysStrAr || item.daysStrEn}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                      <Clock className="w-3.5 h-3.5 text-secondary/70" />
                                      <span className="text-[11px] font-black text-secondary">{item.startTime} — {item.endTime}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl group-hover/row:border-secondary/30 transition-all duration-500">
                                    <MapPin className="w-3.5 h-3.5 text-secondary/70" />
                                    <span className="text-[11px] font-black text-muted-foreground/80">{item.room || 'TBA'}</span>
                                  </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                  <div className="flex items-center gap-3 justify-end">
                                    <div className="w-9 h-9 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover/row:scale-110 group-hover/row:rotate-6 transition-all duration-500">
                                      <User className="w-4 h-4 text-secondary" />
                                    </div>
                                    <span className="text-sm font-bold text-foreground/80">{isAr ? item.instructorAr : item.instructor}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative p-0 md:p-4">
                    {/* Mobile Day Selector */}
                    <div className="flex md:hidden items-center justify-between p-4 border-b border-border/20 bg-background/50">
                      <button 
                        onClick={() => setActiveDayIndex(prev => Math.max(0, prev - 1))}
                        disabled={activeDayIndex === 0}
                        className="p-2 rounded-xl bg-white/5 disabled:opacity-20"
                      >
                        <ChevronRight className="w-5 h-5 text-secondary" />
                      </button>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-secondary uppercase tracking-widest">{isAr ? "اليوم المعروض" : "DISPLAYED DAY"}</span>
                        <span className="text-lg font-black text-foreground">{isAr ? WEEKDAYS[activeDayIndex].label : WEEKDAYS[activeDayIndex].labelEn}</span>
                      </div>
                      <button 
                        onClick={() => setActiveDayIndex(prev => Math.min(WEEKDAYS.length - 1, prev + 1))}
                        disabled={activeDayIndex === WEEKDAYS.length - 1}
                        className="p-2 rounded-xl bg-white/5 disabled:opacity-20"
                      >
                        <ChevronLeft className="w-5 h-5 text-secondary" />
                      </button>
                    </div>

                    <div className="relative overflow-x-auto md:overflow-visible" style={{ height: `${GRID_HEIGHT}px`, minWidth: "100%" }}>
                      {/* Grid Lines */}
                      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-5 ml-0 md:ml-14 rtl:ml-0 rtl:md:mr-14">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={cn("border-r border-border/5 last:border-0", i !== activeDayIndex && "hidden md:block")} />
                        ))}
                      </div>
                      <div className="absolute inset-0 mt-12 ml-14 rtl:ml-0 rtl:mr-14">
                        {TIME_SLOTS.map((_, i) => (
                          <div key={i} className="border-b border-border/5" style={{ height: `${ROW_HEIGHT}px` }} />
                        ))}
                      </div>

                      <div className="relative h-full flex flex-col">
                        {/* Headers (Hidden on Mobile) */}
                        <div className="hidden md:grid h-12 grid-cols-5 ml-14 rtl:ml-0 rtl:mr-14 border-b border-border/20">
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
                              {scheduleViews.gridItems
                                .filter(item => {
                                  // On mobile, only show items for the activeDayIndex
                                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                    return item.day === WEEKDAYS[activeDayIndex].id;
                                  }
                                  return true;
                                })
                                .map((item, idx) => {
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
                                      className="absolute p-1 overflow-hidden group cursor-pointer transition-all hover:z-10 schedule-item-responsive"
                                      style={{
                                        top: `${top}px`,
                                        height: `${height}px`,
                                      }}
                                    >
                                    <style>{`
                                        .schedule-item-responsive {
                                          width: 20%;
                                          ${isAr ? 'right' : 'left'}: ${dayIndex * 20}%;
                                        }
                                        @media (max-width: 768px) {
                                          .schedule-item-responsive {
                                            width: 100%;
                                            left: 0 !important;
                                            right: 0 !important;
                                          }
                                        }
                                      `}</style>
                                      <div className="h-full w-full rounded-2xl bg-secondary/15 border-2 border-secondary/30 shadow-md shadow-secondary/[0.02] backdrop-blur-md p-3 flex flex-col justify-between group-hover:bg-secondary/25 group-hover:border-secondary/50 transition-all border-l-4 border-l-secondary">
                                        <div className="space-y-0.5 text-right">
                                          <h4 className="text-xs font-black leading-tight text-foreground line-clamp-2">{isAr ? item.courseNameAr : item.courseName}</h4>
                                          <div className="flex items-center justify-end gap-1.5 opacity-50">
                                            <span className="text-[10px] font-bold">{isAr ? item.instructorAr : item.instructor}</span>
                                            <User className="w-3 h-3" />
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                          <div className="flex items-center gap-1 text-[10px] font-black bg-surface/80 px-1.5 py-0.5 rounded-lg border border-border/20">
                                            <MapPin className="w-3 h-3 text-secondary" />
                                            <span>{item.room}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-[10px] font-black text-secondary">
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
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-40 px-10 text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full" />
                    <Calendar className="w-20 h-20 text-secondary/40 relative z-10" />
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
