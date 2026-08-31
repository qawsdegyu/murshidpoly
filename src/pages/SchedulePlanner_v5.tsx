import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Scale, BookOpen, Search, Sparkles, Filter, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User, Check, AlertTriangle, Download, Trash2, Plus,
  Settings2, Layers, Info, Maximize2, Minimize2, Loader2, Table2, LayoutGrid, Edit, AlertCircle, X, Layout, Camera, ChevronDown, Brain
, Copy, ImageDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isUserAdmin } from "@/lib/admin";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { majors, Course, faculty as facultyList } from "@/data/mockData";
import { roadmapNodes } from "@/data/roadmapData";
import { Section } from "@/data/sections";
import { supabase } from "@/lib/supabase";
import { mapUniversityCourseToCourse, mapUniversityCourseToSection } from "@/lib/university-mapper";
import { getSuggestedCourses, generateSchedules as runGenerator, ScheduleOption, findConflicts } from "../services/schedule-service";
import { generateLocalSchedules } from "../services/local-schedule-engine";
import PageHeader from "../components/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import localUniversityData from "../data/university_data.json";
import SchedulePlannerSkeleton from "@/components/skeletons/SchedulePlannerSkeleton";
import html2canvas from "html2canvas";
import ExamStudyPlanner from "@/components/ExamStudyPlanner";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import FeatureGate, { hasFeatureAccess } from "@/components/FeatureGate";

const WEEKDAYS = [
  { id: "sunday", label: "الأحد", labelEn: "Sunday" },
  { id: "monday", label: "الاثنين", labelEn: "Monday" },
  { id: "tuesday", label: "الثلاثاء", labelEn: "Tuesday" },
  { id: "wednesday", label: "الأربعاء", labelEn: "Wednesday" },
  { id: "thursday", label: "الخميس", labelEn: "Thursday" },
];

const runSupabaseWithRetry = async (queryFn: () => Promise<any>, retries = 3, delay = 1000, isAr = true): Promise<any> => {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await queryFn();
      if (!res.error) return res;
      if (i === retries) return res;
    } catch (e) {
      if (i === retries) throw e;
    }
    toast.info(isAr
      ? `⚠️ مشكلة بالاتصال. جارٍ إعادة المحاولة تلقائياً... (${retries - i} محاولات متبقية)`
      : `⚠️ Connection issue. Retrying automatically... (${retries - i} retries left)`
    );
    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
  }
};

const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

export default function SchedulePlanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scheduleRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const { lang } = usePreferences();
  const siteSettings = useSiteSettings();
  const isAr = lang === "ar";
  const isAdmin = isUserAdmin(user?.email);

  const [isSelectionReviewOpen, setIsSelectionReviewOpen] = useState(false);
  const [showExamPlanner, setShowExamPlanner] = useState(() => searchParams.get("planner") === "exams");
  const autoCourseId = searchParams.get("course");
  const autoCourseMode = searchParams.get("auto") === "1";
  const autoCourseHandled = useRef<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [countdown, setCountdown] = useState(3);

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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
  const [includeClosedSections, setIncludeClosedSections] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [dayConflictedCourses, setDayConflictedCourses] = useState<any[]>([]);

  const toggleDay = (day: number) => {
    setIsCustomMode(true);
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        if (prev.length === 1) {
          toast.warning(isAr ? "يجب اختيار يوم واحد على الأقل للدوام!" : "At least one study day must be selected!");
          return prev;
        }
        return prev.filter(d => d !== day).sort();
      } else {
        return [...prev, day].sort();
      }
    });
  };

  const applyPreset = (preset: 'all' | 'sth' | 'mw' | 'summer' | 'custom') => {
    if (preset === 'custom') {
      setIsCustomMode(true);
      return;
    }
    setIsCustomMode(false);
    const allowedDaysMap: Record<'sth' | 'mw' | 'summer' | 'all', number[]> = {
      all: [0, 1, 2, 3, 4],
      sth: [0, 2, 4],
      mw: [1, 3],
      summer: [0, 1, 2, 3]
    };
    setSelectedDays(allowedDaysMap[preset]);
  };

  const activePreset = useMemo(() => {
    const sorted = [...selectedDays].sort().join(',');
    if (sorted === "0,1,2,3,4") return 'all';
    if (sorted === "0,2,4") return 'sth';
    if (sorted === "1,3") return 'mw';
    if (sorted === "0,1,2,3") return 'summer';
    return 'custom';
  }, [selectedDays]);


  // Local helper to lookup section status reactively from the 1-minute silent background updates
  const isSectionClosed = (sec: Section) => {
    const currentSec = dbSections.find(s => s.id === sec.id);
    const status = currentSec ? currentSec.status : sec.status;
    if (!status) return false;
    const statusStr = status.toString().trim();
    return statusStr === '0' || statusStr === '3' || statusStr === 'مغلقة' || statusStr.toLowerCase() === 'closed';
  };

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'processing' | 'optimizing'>('idle');
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("murshid_schedule_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.selectedMajor) setSelectedMajor(parsed.selectedMajor);
        if (parsed.selectedYear) setSelectedYear(parsed.selectedYear);
        if (parsed.selectedSemester) setSelectedSemester(parsed.selectedSemester);
        if (parsed.semesterType) setSemesterType(parsed.semesterType);
        if (parsed.targetHours) setTargetHours(parsed.targetHours);
        if (parsed.includeClosedSections !== undefined) {
          setIncludeClosedSections(parsed.includeClosedSections);
        }
        if (parsed.selectedDays && Array.isArray(parsed.selectedDays)) {
          setSelectedDays(parsed.selectedDays);
          if (parsed.isCustomMode !== undefined) {
            setIsCustomMode(parsed.isCustomMode);
          } else {
            const sorted = [...parsed.selectedDays].sort().join(',');
            const isStandard = sorted === "0,1,2,3,4" || sorted === "0,2,4" || sorted === "1,3" || sorted === "1,2,3,4";
            setIsCustomMode(!isStandard);
          }
        } else if (parsed.preferredDays !== undefined) {
          const allowedDaysMap: Record<string, number[]> = {
            all: [0, 1, 2, 3, 4],
            sth: [0, 2, 4],
            mw: [1, 3],
            summer: [1, 2, 3, 4]
          };
          setSelectedDays(allowedDaysMap[parsed.preferredDays] || [0, 1, 2, 3, 4]);
          setIsCustomMode(parsed.preferredDays === 'custom');
        }
        if (parsed.activePlan && Array.isArray(parsed.activePlan)) {
          setActivePlan(parsed.activePlan);
          toast.success(isAr
            ? "💾 تم استعادة مسودتك المحفوظة تلقائياً!"
            : "💾 Your saved draft was auto-restored!"
          );
        }
      } catch (e) {
        console.error("Failed to parse saved draft:", e);
      }
    }
  }, []);

  // Save draft to localStorage on selection changes
  useEffect(() => {
    if (!isDataLoading) {
      const draft = {
        selectedMajor,
        selectedYear,
        selectedSemester,
        semesterType,
        targetHours,
        activePlan,
        includeClosedSections,
        selectedDays,
        isCustomMode
      };
      localStorage.setItem("murshid_schedule_draft", JSON.stringify(draft));
    }
  }, [selectedMajor, selectedYear, selectedSemester, semesterType, targetHours, activePlan, includeClosedSections, selectedDays, isCustomMode, isDataLoading]);

  // Fetch Data from Supabase
  useEffect(() => {
    async function fetchData(showSpinner = true) {
      if (showSpinner) setIsDataLoading(true);
      try {
        // Fetching each one separately with automatic retries and high limits (fetching up to 10k items)
        const coursesRes = await runSupabaseWithRetry(async () => await supabase.from('courses').select('*').limit(5000), 3, 1000, isAr);
        const sectionsRes = await runSupabaseWithRetry(async () => await supabase.from('sections').select('*').limit(5000), 3, 1000, isAr);
        const uniCoursesRes = await runSupabaseWithRetry(async () => await supabase.from('university_courses').select('*').limit(10000), 3, 1000, isAr);
        const deptsRes = await runSupabaseWithRetry(async () => await supabase.from('departments').select('*').limit(500), 3, 1000, isAr);
        const availableSectionsRes = await runSupabaseWithRetry(async () => await supabase.from('available_sections').select('*').limit(5000), 3, 1000, isAr);

        if (coursesRes.error) console.error("Courses Load Error:", coursesRes.error);
        if (sectionsRes.error) console.error("Sections Load Error:", sectionsRes.error);
        if (uniCoursesRes.error) console.error("University Courses Load Error:", uniCoursesRes.error);
        if (availableSectionsRes.error) console.error("Available Sections Load Error:", availableSectionsRes.error);

        let finalCourses: Course[] = [];
        let finalSections: Section[] = [];

        // Build a local departments map (ID -> Name)
        const deptsMap: Record<string, string> = {};
        if (deptsRes && deptsRes.data) {
          deptsRes.data.forEach((d: any) => {
            deptsMap[d.id] = d.name;
          });
        }

        // Seed with local JSON departments to ensure full offline compatibility
        if (localUniversityData && Array.isArray(localUniversityData.departments)) {
          localUniversityData.departments.forEach((d: any) => {
            deptsMap[d.id] = d.name;
          });
        }

        // 1. Process legacy courses
        const legacyCourses: Course[] = [];
        if (coursesRes.data) {
          coursesRes.data.forEach(c => {
            legacyCourses.push({
              id: c.id,
              code: c.code,
              name: c.name_en || c.name_ar,
              nameAr: c.name_ar,
              hours: c.credit_hours,
              department: c.department || "General",
              category: "common"
            });
          });
        }

        // 2. Process legacy sections
        const legacySections: Section[] = [];
        if (sectionsRes.data) {
          sectionsRes.data.forEach(s => {
            legacySections.push({
              id: s.id.toString(),
              courseId: s.course_id,
              instructorId: 'manual',
              instructorName: s.instructor_name,
              days: Array.isArray(s.days) ? s.days : [],
              startTime: s.start_time,
              endTime: s.end_time,
              room: s.room,
              status: s.status ? s.status.toString() : '1'
            });
          });
        }

        // 3. Process university sync courses and sections
        const uniCourses: Course[] = [];
        const uniSections: Section[] = [];

        // Prefer the synchronized Supabase snapshot. Local JSON is a fallback only when the source is unavailable.
        const sourceCourses = (uniCoursesRes.data && uniCoursesRes.data.length > 0)
          ? uniCoursesRes.data
          : ((localUniversityData && Array.isArray(localUniversityData.courses)) ? localUniversityData.courses : []);

        const isCancelledStatus = (status: unknown) => {
          const normalized = String(status ?? '').trim().toLowerCase();
          return normalized === '2' || normalized === 'ملغاة' || normalized === 'ملغى' || normalized === 'cancelled' || normalized === 'canceled';
        };
        const extractTimeRange = (row: any) => {
          const explicitStart = row.time_start || row.start_time;
          const explicitEnd = row.time_end || row.end_time;
          if (explicitStart || explicitEnd) {
            return { start: explicitStart || '08:00', end: explicitEnd || '09:00' };
          }
          const times = String(row.times || '').match(/\b\d{1,2}:\d{2}\b/g) || [];
          return { start: times[0] || '08:00', end: times[1] || times[0] || '09:00' };
        };

        sourceCourses.filter((rc: any) => !isCancelledStatus(rc.status)).forEach((rc: any) => {
          uniCourses.push({
            id: rc.course_no,
            code: rc.course_no,
            name: rc.name,
            nameAr: rc.name,
            hours: parseInt(rc.hours) || 3,
            department: deptsMap[rc.department_id] || rc.department_id || "General",
            category: "common"
          });
        });

        if (sourceCourses.length > 0) {
          const dayChars: Record<string, number> = { 'ح': 0, 'ن': 1, 'ث': 2, 'ر': 3, 'خ': 4 };
          sourceCourses.filter((s: any) => !isCancelledStatus(s.status)).forEach((s: any) => {
            const daysStr = s.days || s.times || '';
            const days: number[] = [];
            for (const char of String(daysStr).split(' ')) {
              if (dayChars[char] !== undefined) days.push(dayChars[char]);
            }
            const rawStatus = String(s.status ?? '').trim();
            const closed = rawStatus === '3' || rawStatus === 'مغلقة' || rawStatus.toLowerCase() === 'closed';
            const timeRange = extractTimeRange(s);
            uniSections.push({
              id: s.id || `${s.course_no}_${s.section_no || s.section_number}`,
              courseId: s.course_no,
              instructorId: 'uni-sync',
              instructorName: s.lecturers === 'غير محدد' ? 'TBA' : (s.lecturers || s.instructor || 'TBA'),
              days,
              startTime: timeRange.start,
              endTime: timeRange.end,
              room: s.rooms === 'غير محدد' ? 'Online' : (s.rooms || s.room || 'Online'),
              status: closed ? '3' : '1',
              sectionNo: (s.section_no || s.section_number)?.toString()
            });
          });
        } else if (availableSectionsRes.data && availableSectionsRes.data.length > 0) {
          // Legacy fallback only when no synchronized university snapshot exists.
          availableSectionsRes.data.filter((s: any) => !isCancelledStatus(s.status)).forEach((s: any) => {
            uniSections.push({ ...mapUniversityCourseToSection(s), status: String(s.status ?? '1') });
          });
        } else {
          sourceCourses.forEach((rc: any) => uniSections.push(...mapUniversityCourseToSection(rc)));
        }

        // 4. Perform a comprehensive deduplicated merge
        const coursesMap = new Map<string, Course>();

        // Seed with legacy courses first
        legacyCourses.forEach(c => {
          const normKey = c.code ? c.code.replace(/[\s-]/g, '').toUpperCase() : c.id;
          coursesMap.set(normKey, c);
        });

        // Add/merge university sync courses (which overwrite or extend legacy courses)
        uniCourses.forEach(uc => {
          const normKey = uc.code ? uc.code.replace(/[\s-]/g, '').toUpperCase() : uc.id;

          if (coursesMap.has(normKey)) {
            const existing = coursesMap.get(normKey)!;
            coursesMap.set(normKey, {
              ...existing,
              name: uc.name || existing.name,
              nameAr: uc.nameAr || existing.nameAr,
              hours: uc.hours || existing.hours,
              department: uc.department && uc.department !== "General" ? uc.department : existing.department,
            });
          } else {
            coursesMap.set(normKey, uc);
          }
        });

        finalCourses = Array.from(coursesMap.values());
        // The official snapshot is the sole planning source when available.
        // Legacy sections remain a fallback only when the snapshot is unavailable.
        finalSections = uniCourses.length > 0 ? uniSections : [...legacySections, ...uniSections];

        setDbCourses(finalCourses);
        setDbSections(finalSections);

        // Only show error if core tables failed
        if (coursesRes.error || sectionsRes.error) {
          if (showSpinner) toast.error(isAr ? "فشل تحميل بعض البيانات الأساسية" : "Failed to load some core data");
        }

      } catch (err) {
        console.error("Critical error fetching schedule data:", err);
        if (showSpinner) {
          toast.error(isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
        }
      } finally {
        if (showSpinner) setIsDataLoading(false);
      }
    }

    // Initial load
    fetchData(true);

    // Silently fetch fresh data every 60 seconds (1 minute)
    const intervalId = setInterval(() => {
      fetchData(false);
    }, 60000);

    return () => clearInterval(intervalId);
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
  const maxHours = 21;

  // Sync targetHours with maxHours
  useEffect(() => {
    if (targetHours > maxHours) {
      setTargetHours(maxHours);
    }
  }, [maxHours, targetHours]);

  // Success Overlay Redirect Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessOverlay) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/my-schedule");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showSuccessOverlay, navigate]);

  // University Newspaper Integration - Show all courses that have sections in the DB
  const baseCourses = useMemo(() => {
    if (isDataLoading) return [];
    
    // Pre-calculate section course IDs for O(1) lookup
    const sectionCourseIds = new Set<string>();
    for (const s of dbSections) {
      if (s.courseId) {
        sectionCourseIds.add(s.courseId);
        sectionCourseIds.add(s.courseId.replace(/[\s-]/g, '').toUpperCase());
      }
    }

    return dbCourses.filter(c => {
      if (sectionCourseIds.has(c.id)) return true;
      if (c.code && sectionCourseIds.has(c.code)) return true;
      if (c.code && sectionCourseIds.has(c.code.replace(/[\s-]/g, '').toUpperCase())) return true;
      return false;
    });
  }, [dbCourses, dbSections, isDataLoading]);

  const recommendedCourses = useMemo(() => {
    if (isDataLoading) return [];

    const queryNormalized = searchQuery.toLowerCase().trim();
    const filtered = queryNormalized
      ? baseCourses.filter(c => {
        const nameEn = String(c?.name || "").toLowerCase();
        const nameAr = String(c?.nameAr || "").toLowerCase();
        const code = String(c?.code || "").toLowerCase();
        return nameEn.includes(queryNormalized) || nameAr.includes(queryNormalized) || code.includes(queryNormalized);
      })
      : baseCourses;

    return filtered.sort((a, b) => {
      // Priority keywords for "Computer/Network Security"
      const priorityKeywords = ['حاسوب', 'شبكات', 'برمجة', 'أمن', 'قواعد بيانات', 'ذكاء', 'خوارزميات', 'Computer', 'Network', 'Security', 'Programming'];

      const aNameAr = String(a?.nameAr || "").toLowerCase();
      const aNameEn = String(a?.name || "").toLowerCase();
      const bNameAr = String(b?.nameAr || "").toLowerCase();
      const bNameEn = String(b?.name || "").toLowerCase();

      const aIsPriority = priorityKeywords.some(kw => aNameAr.includes(kw.toLowerCase()) || aNameEn.includes(kw.toLowerCase()));
      const bIsPriority = priorityKeywords.some(kw => bNameAr.includes(kw.toLowerCase()) || bNameEn.includes(kw.toLowerCase()));

      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;

      return (isAr ? a.nameAr : a.name).localeCompare(isAr ? b.nameAr : b.name);
    });
  }, [baseCourses, isDataLoading, searchQuery, isAr]);

  // Categorize courses into the 8+ groups shown in newspaper layout
  // PRIORITY ORDER: 1) Real department name, 2) Course code prefix, 3) Name keywords
  const categorizedCourses = useMemo(() => {
    const categoriesMap: Record<string, { id: string; nameAr: string; nameEn: string; courses: Course[] }> = {
      humanities: { id: "humanities", nameAr: "العلوم الاساسية الانسانية", nameEn: "Humanities Basic Sciences", courses: [] },
      scientific: { id: "scientific", nameAr: "العلوم الاساسية العلمية", nameEn: "Scientific Basic Sciences", courses: [] },
      engineering_basic: { id: "engineering_basic", nameAr: "العلوم الهندسية الاساسية", nameEn: "Basic Engineering Sciences", courses: [] },
      computer: { id: "computer", nameAr: "هندسة الحاسوب", nameEn: "Computer Engineering", courses: [] },
      electrical: { id: "electrical", nameAr: "الهندسة الكهربائية", nameEn: "Electrical Engineering", courses: [] },
      chemical: { id: "chemical", nameAr: "الهندسة الكيميائية", nameEn: "Chemical Engineering", courses: [] },
      civil: { id: "civil", nameAr: "الهندسة المدنية", nameEn: "Civil Engineering", courses: [] },
      mechanical: { id: "mechanical", nameAr: "الهندسة الميكانيكية", nameEn: "Mechanical Engineering", courses: [] },
      mechatronics: { id: "mechatronics", nameAr: "هندسة الميكاترونكس", nameEn: "Mechatronics Engineering", courses: [] },
      projects: { id: "projects", nameAr: "مشاريع التخرج", nameEn: "Graduation Projects", courses: [] }
    };

    // ─── Helper: Classify a course by its REAL department name (highest priority) ───
    const classifyByDepartment = (dept: string): string | null => {
      const d = dept.toLowerCase();
      // Exact match on known department names from the university DB
      if (d === "العلوم الاساسية الانسانية" || d === "humanities") return "humanities";
      if (d === "العلوم الاساسية العلمية" || d === "basic sciences" || d === "basic" || d === "sciences") return "scientific";
      if (d === "العلوم الهندسية الاساسية" || d === "basic engineering") return "engineering_basic";
      if (d === "الهندسة الكهربائية" || d === "electrical" || d === "electrical_computer" || d === "electrical engineering") return "electrical";
      if (d === "الهندسة الكيميائية" || d === "chemical" || d === "chemical engineering") return "chemical";
      if (d === "الهندسة المدنية" || d === "civil" || d === "civil engineering") return "civil";
      if (d === "الهندسة الميكانيكية" || d === "mechanical" || d === "mechanical engineering") return "mechanical";
      if (d === "هندسة الميكاترونيكس" || d === "هندسة الميكاترونكس" || d === "mechatronics" || d === "mechatronics engineering") return "mechatronics";
      // Partial match fallback
      if (d.includes("إنسانية") || d.includes("انساني")) return "humanities";
      if (d.includes("علوم أساسية") || d.includes("علوم اساسية")) return "scientific";
      if (d.includes("كهربائية")) return "electrical";
      if (d.includes("كيميائية")) return "chemical";
      if (d.includes("مدنية")) return "civil";
      if (d.includes("ميكانيكية")) return "mechanical";
      if (d.includes("ميكاترونكس") || d.includes("ميكاترونيكس")) return "mechatronics";
      return null;
    };

    // ─── Helper: Classify by course code prefix (second priority) ───
    const classifyByCode = (code: string): string | null => {
      if (!code) return null;
      const upper = code.replace(/[\s-]/g, '').toUpperCase();
      // ELE = shared between Electrical (dept 1) AND Mechatronics (dept 7)
      // → Don't classify by code alone; let department_id handle it
      // BUT if department didn't match (step 1 returned null), default to electrical
      if (upper.startsWith("ELE")) return "electrical";
      // CPE = Computer Engineering (mockData only)
      if (upper.startsWith("CPE")) return "computer";
      // CS = Computer Science
      if (upper.startsWith("CS")) return "computer";
      // CIE = Civil Engineering (university_data.json)
      if (upper.startsWith("CIE")) return "civil";
      // IEC = Civil related (e.g., IEC101)
      if (upper.startsWith("IEC")) return "civil";
      // SGE = Basic Engineering (surveying, drawing — Civil dept)
      if (upper.startsWith("SGE")) return "engineering_basic";
      // ART = Architecture/Civil related
      if (upper.startsWith("ART")) return "civil";
      // MEE = Mechanical Engineering
      if (upper.startsWith("MEE")) return "mechanical";
      // MHV = Mechanical/Vehicles
      if (upper.startsWith("MHV")) return "mechanical";
      // HHT = Mechanical
      if (upper.startsWith("HHT")) return "mechanical";
      // MEC = Mechanical (mockData)
      if (upper.startsWith("MEC")) return "mechanical";
      // CVE = Civil (mockData)
      if (upper.startsWith("CVE")) return "civil";
      // CE = Civil (mockData, but not CHE)
      if (upper.startsWith("CE") && !upper.startsWith("CHE")) return "civil";
      // CHE = Chemical Engineering
      if (upper.startsWith("CHE")) return "chemical";
      // MTE = Mechatronics
      if (upper.startsWith("MTE")) return "mechatronics";
      // ECT = Electrical/Communication Tech
      if (upper.startsWith("ECT")) return "electrical";
      // BSE = Basic Science for Engineering (shared dept)
      if (upper.startsWith("BSE")) return "scientific";
      // AAL/AEL = Arabic/English Language
      if (upper.startsWith("AAL") || upper.startsWith("AEL")) return "humanities";
      // NE/TS = National Education / Traffic Safety
      if (upper.startsWith("NE") || upper.startsWith("TS")) return "humanities";
      // EE/TE/NS/AT/IE = mockData prefixes
      if (upper.startsWith("EE")) return "electrical";
      if (upper.startsWith("TE")) return "electrical";
      if (upper.startsWith("NS")) return "computer";
      if (upper.startsWith("AT")) return "mechatronics";
      if (upper.startsWith("IE")) return "mechanical";
      // Numeric codes: department_id based range
      if (/^30[12]/.test(upper)) return "scientific";  // 301xx, 302xx = physics, math
      if (/^302[0-9]{2}/.test(upper)) return "scientific"; // 302xx = math
      if (/^36/.test(upper)) return "humanities";  // 36xxx = Islamic/Arabic studies
      if (/^60/.test(upper)) return "humanities";  // 60xxx = general education
      if (/^35/.test(upper)) return "humanities";  // 35xxx = military science
      return null;
    };

    // ─── Helper: Classify by name keywords (lowest priority fallback) ───
    const classifyByName = (nameAr: string, nameEn: string): string => {
      const arStr = nameAr || "";
      const enStr = (nameEn || "").toLowerCase();

      // Graduation Projects — always check first
      if (arStr.includes("مشروع") || arStr.includes("تخرج") || enStr.includes("project") || enStr.includes("graduation")) {
        return "projects";
      }

      // ─── ENGINEERING CATEGORIES (check before Humanities to avoid false positives) ───

      // Electrical/Telecom/Power
      if (
        arStr.includes("اتصالات") || arStr.includes("الاتصالات") ||
        arStr.includes("كهربائية") || arStr.includes("الكترونيات") || arStr.includes("إلكترونيات") ||
        arStr.includes("دوائر كهربائية") || arStr.includes("قوى كهربائية") ||
        arStr.includes("اشارات") || arStr.includes("إشارات") ||
        arStr.includes("أمواج") || arStr.includes("امواج") ||
        arStr.includes("طاقة متجددة") || arStr.includes("آلات كهربائية") || arStr.includes("الات كهربائية") ||
        arStr.includes("منطق رقمي") || arStr.includes("تحكم تماثلي") ||
        arStr.includes("محولات") || arStr.includes("محركات") ||
        arStr.includes("تراسل البيانات") ||
        enStr.includes("electrical") || enStr.includes("electronics") || enStr.includes("circuit") ||
        enStr.includes("signal") || enStr.includes("telecom") || enStr.includes("communication") ||
        enStr.includes("power") || enStr.includes("microwave") || enStr.includes("antenna") ||
        enStr.includes("electromagnetic")
      ) {
        return "electrical";
      }

      // Computer/Network/Security
      if (
        arStr.includes("حاسوب") || arStr.includes("حاسب") ||
        arStr.includes("برمج") ||
        arStr.includes("شبكات") || arStr.includes("الشبكات") ||
        arStr.includes("قواعد بيانات") || arStr.includes("قواعد البيانات") ||
        arStr.includes("أمن المعلومات") || arStr.includes("أمن شبكات") || arStr.includes("سيبراني") ||
        arStr.includes("ذكاء اصطناعي") || arStr.includes("تعلم الالة") || arStr.includes("تعلم الآلة") ||
        arStr.includes("انظمة مضمنة") || arStr.includes("أنظمة مضمنة") ||
        arStr.includes("خوارزمي") || arStr.includes("تراكيب البيانات") ||
        arStr.includes("تشفير") || arStr.includes("انترنت الاشياء") || arStr.includes("إنترنت الأشياء") ||
        arStr.includes("معالجات دقيقة") || arStr.includes("معالجات الدقيقة") ||
        arStr.includes("كينونة") || arStr.includes("الكيــــنونة") ||
        arStr.includes("نظم تشغيل") ||
        arStr.includes("بروتوكولات") ||
        arStr.includes("ادلة رقمية") || arStr.includes("أدلة رقمية") ||
        enStr.includes("computer") || enStr.includes("network") || enStr.includes("software") ||
        enStr.includes("security") || enStr.includes("database") || enStr.includes("cyber") ||
        enStr.includes("algorithm") || enStr.includes("embedded") || enStr.includes("iot") ||
        enStr.includes("artificial intelligence") || enStr.includes("machine learning") ||
        enStr.includes("data structure") || enStr.includes("protocol")
      ) {
        return "computer";
      }

      // Mechatronics
      if (
        arStr.includes("ميكاترونكس") || arStr.includes("ميكاترونيكس") ||
        arStr.includes("روبوت") || arStr.includes("أتمتة") || arStr.includes("اتمتة") ||
        arStr.includes("تحكم") || arStr.includes("متحكمات") ||
        arStr.includes("مجسات") || arStr.includes("هيدروليك") || arStr.includes("نيوماتك") ||
        enStr.includes("mechatronics") || enStr.includes("robot") || enStr.includes("control") ||
        enStr.includes("automation") || enStr.includes("plc") || enStr.includes("sensor") ||
        enStr.includes("hydraulic") || enStr.includes("pneumatic")
      ) {
        return "mechatronics";
      }

      // Civil
      if (arStr.includes("مدنية") || enStr.includes("civil")) return "civil";

      // Chemical
      if (arStr.includes("كيميائية") || enStr.includes("chemical")) return "chemical";

      // Mechanical
      if (arStr.includes("ميكانيكية") || enStr.includes("mechanical")) return "mechanical";

      // ─── NON-ENGINEERING CATEGORIES ───

      // Scientific Basic Sciences (math, physics, chemistry)
      if (
        arStr.includes("رياضيات") || arStr.includes("فيزياء") || arStr.includes("كيمياء") ||
        arStr.includes("إحصاء") || arStr.includes("احصاء") || arStr.includes("تفاضل") ||
        arStr.includes("تكامل") || arStr.includes("جبر خطي") || arStr.includes("معادلات تفاضلية") ||
        enStr.includes("math") || enStr.includes("physics") || enStr.includes("chemistry") ||
        enStr.includes("calculus") || enStr.includes("statistic") || enStr.includes("linear algebra") ||
        enStr.includes("differential equation")
      ) {
        return "scientific";
      }

      // Humanities (Arabic, English, culture, etc.)
      // ⚠️ SPECIFIC terms only — "مهارات اتصال" not generic "اتصال"
      if (
        arStr.includes("عربي") || arStr.includes("إنجليزي") || arStr.includes("انجليزي") ||
        arStr.includes("وطنية") || arStr.includes("ثقافة") || arStr.includes("أخلاقيات") ||
        arStr.includes("مهارات اتصال") || arStr.includes("مهارات التواصل") ||
        arStr.includes("إسلام") || arStr.includes("اسلام") || arStr.includes("سيرة") ||
        arStr.includes("خلفاء") || arStr.includes("ريادة") || arStr.includes("ابتكار") ||
        arStr.includes("سلامة مرورية") || arStr.includes("عسكرية") ||
        enStr.includes("arabic") || enStr.includes("english") || enStr.includes("culture") ||
        enStr.includes("national") || enStr.includes("ethics") || enStr.includes("humanities") ||
        enStr.includes("islamic") || enStr.includes("military")
      ) {
        return "humanities";
      }

      // Basic Engineering Sciences (drawing, intro to engineering, etc.)
      if (
        arStr.includes("رسم هندسي") || arStr.includes("مدخل") || arStr.includes("ورشة") ||
        enStr.includes("engineering drawing") || enStr.includes("workshop") ||
        enStr.includes("introduction to engineering")
      ) {
        return "engineering_basic";
      }

      // Default: Electrical (catch-all for unknown engineering courses)
      return "electrical";
    };

    // ─── MAIN CLASSIFICATION LOOP ───
    recommendedCourses.forEach(c => {
      const dept = c.department || "";
      const code = c.code || "";
      const nameAr = c.nameAr || "";
      const nameEn = c.name || "";

      // ─── SUPER OVERRIDE FOR GENERAL HUMANITIES / SKILLS VS ENGINEERING TELECOM ───
      let category: string | null = null;
      const arStr = nameAr;
      const enStr = (nameEn || "").toLowerCase();

      // Check if it's a general humanities / communication skills course first
      if (
        arStr.includes("مهارات اتصال") ||
        arStr.includes("مهارات الاتصال") ||
        arStr.includes("مهارات التواصل") ||
        arStr.includes("مهارات تواصل") ||
        arStr.includes("اتصالات تواصل") ||
        arStr.includes("تواصل") ||
        arStr.includes("مهارات الحياتية") ||
        enStr.includes("communication skills") ||
        enStr.includes("interpersonal") ||
        enStr.includes("life skills")
      ) {
        category = "humanities";
      }
      // Check if it's a specific engineering telecom/microwave/circuits/signals course
      else if (
        arStr.includes("اتصالات الأمواج") ||
        arStr.includes("اتصالات الامواج") ||
        arStr.includes("الأمواج الدقيقة") ||
        arStr.includes("الامواج الدقيقة") ||
        arStr.includes("اتصالات رقمية") ||
        arStr.includes("اتصالات تشابهية") ||
        arStr.includes("اتصالات وتراسل") ||
        arStr.includes("دوائر الاتصالات") ||
        arStr.includes("اتصالات لاسلكية") ||
        arStr.includes("اتصالات بصرية") ||
        arStr.includes("مختبر اتصالات") ||
        arStr.includes("شبكات الاتصالات") ||
        arStr.includes("أنظمة الاتصالات") ||
        arStr.includes("نظم الاتصالات") ||
        arStr.includes("هندسة الاتصالات") ||
        arStr.includes("تراسل البيانات") ||
        arStr.includes("معالجة الإشارات") ||
        arStr.includes("معالجة الاشارات") ||
        enStr.includes("microwave") ||
        enStr.includes("telecom") ||
        enStr.includes("digital communications") ||
        enStr.includes("analog communications") ||
        enStr.includes("optical communications") ||
        enStr.includes("wireless communications") ||
        enStr.includes("data transmission") ||
        enStr.includes("signals and systems")
      ) {
        category = "electrical";
      }

      // Proceed with standard classification if not overridden
      if (!category) {
        // Step 1: Try to classify by real department name (most reliable)
        category = classifyByDepartment(dept);

        // Step 2: If department didn't match, try course code prefix
        if (!category) {
          category = classifyByCode(code);
        }

        // Step 3: If still unmatched, fall back to name keyword matching
        if (!category) {
          category = classifyByName(nameAr, nameEn);
        }
      }

      // Sub-classify electrical department courses into computer vs electrical
      // The ELE department at BAU contains BOTH electrical AND computer engineering courses
      if (category === "electrical") {
        const arStr = nameAr;
        const enStr = (nameEn || "").toLowerCase();
        const codeUpper = code.replace(/[\s-]/g, '').toUpperCase();

        // Computer Engineering sub-courses within ELE department
        const isComputer = (
          arStr.includes("حاسوب") || arStr.includes("حاسب") || arStr.includes("برمج") ||
          arStr.includes("شبكات") || arStr.includes("الشبكات") ||
          arStr.includes("قواعد بيانات") || arStr.includes("قواعد البيانات") ||
          arStr.includes("أمن المعلومات") || arStr.includes("أمن شبكات") || arStr.includes("سيبراني") ||
          arStr.includes("ذكاء اصطناعي") || arStr.includes("تعلم الالة") || arStr.includes("تعلم الآلة") ||
          arStr.includes("أنظمة مضمنة") || arStr.includes("انظمة مضمنة") ||
          arStr.includes("خوارزمي") || arStr.includes("تراكيب البيانات") ||
          arStr.includes("تشفير") || arStr.includes("انترنت الاشياء") || arStr.includes("إنترنت الأشياء") ||
          arStr.includes("كينونة") || arStr.includes("الكيــــنونة") ||
          arStr.includes("نظم تشغيل") || arStr.includes("بروتوكولات") ||
          arStr.includes("ادلة رقمية") || arStr.includes("أدلة رقمية") ||
          arStr.includes("لاسلكية") || arStr.includes("لاسلكيـــة") ||
          enStr.includes("computer") || enStr.includes("network") || enStr.includes("software") ||
          enStr.includes("security") || enStr.includes("database") || enStr.includes("cyber") ||
          enStr.includes("embedded") || enStr.includes("iot") || enStr.includes("wireless") ||
          enStr.includes("ai") || enStr.includes("machine learning") || enStr.includes("protocol") ||
          codeUpper.startsWith("ELE5") || codeUpper.startsWith("ELE6") // ELE5xxx = Computer, ELE6xxx = Network/Security
        );

        if (isComputer) {
          category = "computer";
        }
      }

      // Push to the right category
      if (categoriesMap[category]) {
        categoriesMap[category].courses.push(c);
      } else {
        categoriesMap.electrical.courses.push(c);
      }
    });

    return Object.values(categoriesMap).filter(cat => cat.courses.length > 0);
  }, [recommendedCourses, isAr]);

  // Auto-expand categories during active search filtering
  useEffect(() => {
    if (searchQuery) {
      const nextExpanded: Record<string, boolean> = {};
      categorizedCourses.forEach(cat => {
        nextExpanded[cat.id] = true;
      });
      setExpandedCategories(nextExpanded);
    }
  }, [searchQuery, categorizedCourses]);

  // Initialize with suggested courses - REMOVED auto-fill to prevent confusion
  useEffect(() => {
    // We only fetch data once, and we DON'T auto-fill activePlan anymore
    // This gives the user full control over what goes into the schedule
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

  // Robust course lookup helper that handles case-sensitivity, spaces, and hyphens in IDs and codes
  const findCourseByIdOrCode = (idOrCode: string | undefined) => {
    if (!idOrCode) return undefined;
    const normSearch = normalizeCode(idOrCode);
    return dbCourses.find(c => {
      const normId = c.id ? normalizeCode(c.id) : "";
      const normCode = c.code ? normalizeCode(c.code) : "";
      return normId === normSearch || normCode === normSearch;
    });
  };

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

  const handleAiMagic = async (coursesOverride?: Course[]) => {
    const coursesToGenerate = coursesOverride || activePlan;
    if (coursesToGenerate.length === 0) {
      toast.error(isAr ? "الرجاء اختيار المواد أولاً" : "Please select courses first");
      return;
    }

    setIsGenerating(true);
    setAiSuggestions([]);
    toast.info(isAr ? "جاري إعادة جدولة المواد ذكياً..." : "Intelligently rescheduling...");

    try {
      const { getSmartScheduleRecommendations } = await import("../services/ai-integration");
      // Respect 'Include closed sections' toggle in AI requests
      const sectionsForAi = includeClosedSections
        ? dbSections
        : dbSections.filter(s => !isSectionClosed(s));

      // Update: Passing specific selected courses to the AI
      const res = await getSmartScheduleRecommendations(
        selectedMajor,
        selectedYear,
        selectedSemester,
        sectionsForAi,
        coursesToGenerate,
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

  useEffect(() => {
    if (!autoCourseMode || !autoCourseId || isDataLoading || dbCourses.length === 0 || autoCourseHandled.current === autoCourseId) return;
    const course = findCourseByIdOrCode(autoCourseId);
    if (!course) return;

    autoCourseHandled.current = autoCourseId;
    const alreadySelected = activePlan.some(item => item.id === course.id || (item.code && course.code && normalizeCode(item.code) === normalizeCode(course.code)));
    const nextPlan = alreadySelected ? activePlan : [...activePlan, course];
    setActivePlan(nextPlan);
    toast.success(isAr ? `تمت إضافة ${course.nameAr} وإنشاء جدولها تلقائيًا` : `${course.name} was added and scheduled automatically`);
    void handleAiMagic(nextPlan);

    const cleanParams = new URLSearchParams(searchParams);
    cleanParams.delete("auto");
    cleanParams.delete("course");
    navigate(cleanParams.toString() ? `/schedule?${cleanParams.toString()}` : "/schedule", { replace: true });
  }, [autoCourseMode, autoCourseId, isDataLoading, dbCourses, activePlan, searchParams, navigate, isAr]);

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
        const c = findCourseByIdOrCode(s.courseId);
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

    setIsGenerating(true);
    setGenerationStep('processing');
    setGeneratedSchedules([]);
    setDayConflictedCourses([]); // reset previous warning

    try {
      toast.info(isAr ? "جاري توليد جداول متنوعة..." : "Generating diverse schedules...");

      // Filter sections based on open/closed user preference
      let sectionsForGeneration = includeClosedSections
        ? dbSections
        : dbSections.filter(s => !isSectionClosed(s));

      // Filter sections strictly based on selected study days
      const allowedDays = selectedDays;
      const groups = new Map<string, Section[]>();
      sectionsForGeneration.forEach(s => {
        const key = s.sectionNo ? `${s.courseId}_${s.sectionNo}` : s.id;
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(s);
      });

      const validSections: Section[] = [];
      groups.forEach((slots) => {
        // Check if all slots in this section only meet on allowed days
        const allSlotsValid = slots.every(s => 
          s.days && s.days.length > 0 && s.days.every(d => allowedDays.includes(d))
        );
        if (allSlotsValid) {
          validSections.push(...slots);
        }
      });
      sectionsForGeneration = validSections;

      // ── Eagerly detect day-conflicted courses BEFORE engine call ──
      // This guarantees the warning shows even if schedule generation fails entirely
      const eagerDayConflicted = activePlan
        .filter(course => {
          const normCode = (code: string) => code.replace(/[\s-]/g, '').toUpperCase();
          const hasInDb = dbSections.some(s =>
            s.courseId === course.id ||
            s.courseId === course.code ||
            (course.code && s.courseId && normCode(course.code) === normCode(s.courseId))
          );
          const hasOnSelectedDays = sectionsForGeneration.some(s =>
            s.courseId === course.id ||
            s.courseId === course.code ||
            (course.code && s.courseId && normCode(course.code) === normCode(s.courseId))
          );
          return hasInDb && !hasOnSelectedDays;
        })
        .map(course => {
          const normCode = (code: string) => code.replace(/[\s-]/g, '').toUpperCase();
          const courseSections = dbSections.filter(s =>
            s.courseId === course.id ||
            s.courseId === course.code ||
            (course.code && s.courseId && normCode(course.code) === normCode(s.courseId))
          );
          return { ...course, courseSections };
        });
      setDayConflictedCourses(eagerDayConflicted);

      // ── LOCAL ENGINE: Zero AI credits, 8 different day/time templates ──
      const locals = generateLocalSchedules(
        selectedMajor, selectedYear, selectedSemester,
        dbCourses, sectionsForGeneration, activePlan, aiIntent,
        {
          maxOptions: 8,
          maxStudyDays: 5,
          minStartTime: "08:00",
          includeClosed: includeClosedSections
        }
      );

      if (locals.length > 0) {
        // ── Deduplicate: remove schedules identical to others ──
        const getScheduleSignature = (secs: Section[]) => {
          const slotSigs = secs.map(s => {
            const normCourseId = (s.courseId || "").trim().replace(/[\s-]/g, '').toUpperCase();
            const normStart = (s.startTime || "").trim().replace(/(:\d{2}):\d{2}$/, "$1");
            const normEnd = (s.endTime || "").trim().replace(/(:\d{2}):\d{2}$/, "$1");
            const normDays = s.days ? [...s.days].map(Number).sort((a, b) => a - b).join('') : "";
            return `${normCourseId}-${normStart}-${normEnd}-${normDays}`;
          });
          return Array.from(new Set(slotSigs)).sort().join('|');
        };

        const uniqueLocals = locals.filter((sug, idx, arr) => {
          const sig = getScheduleSignature(sug.sections);
          return arr.findIndex(x => getScheduleSignature(x.sections) === sig) === idx;
        });

        setGeneratedSchedules(uniqueLocals.map(sug => ({
          sections: sug.sections,
          totalHours: sug.totalHours,
          aiTitle: sug.titleAr,
          aiDescription: sug.descriptionAr,
          tag: sug.tag,
          tagColor: sug.tagColor,
          tagEmoji: sug.tagEmoji,
          studyDays: sug.studyDays,
          avgStartHour: sug.avgStartHour,
          personality: sug.personality,
          unmatchedCourses: sug.unmatchedCourses ?? [],
          hasUnmatchedCourses: sug.hasUnmatchedCourses ?? false,
          hasConflict: sug.hasConflict ?? false,
          conflictCount: sug.conflictCount ?? 0,
        })));
        setCurrentOptionIndex(0);
        const count = uniqueLocals.length;
        toast.success(
          count === 1
            ? (isAr ? "✅ تم توليد جدول واحد (بياناتك لا تتيح تنوعاً أكثر)" : "✅ 1 schedule generated (limited section data)")
            : (isAr ? `✅ تم توليد ${count} جداول مختلفة!` : `✅ ${count} diverse schedules generated!`)
        );
      } else {
        // Fallback to old backtracker
        toast.info(isAr ? "تم استخدام المحرك السريع" : "Using fast engine");
        const raw = runGenerator(
          activePlan,
          sectionsForGeneration,
          12,
          [],
          [],
          5,
          "08:00",
          includeClosedSections
        );
        if (raw.length === 0) {
          toast.error(isAr ? "تعذر العثور على جدول" : "No schedule found");
        } else {
          // Deduplicate fallback raw options as well!
          const uniqueRaw = raw.filter((opt, idx, arr) => {
            const sig = getScheduleSignature(opt);
            return arr.findIndex(x => getScheduleSignature(x) === sig) === idx;
          });

          setGeneratedSchedules(uniqueRaw.slice(0, 6).map((opt, idx) => ({
            sections: opt,
            totalHours: opt.reduce((sum, s) => {
              const c = findCourseByIdOrCode(s.courseId);
              return sum + (c?.hours || 0);
            }, 0),
            aiTitle: isAr ? `خيار ${idx + 1}` : `Option ${idx + 1}`,
            aiDescription: isAr ? "تم توليد هذا الجدول محلياً بنجاح." : "Successfully generated this schedule locally.",
            tag: "balanced",
            tagColor: "from-indigo-500 to-blue-500",
            tagEmoji: "⚖️",
            studyDays: new Set(opt.flatMap(s => s.days)).size,
            avgStartHour: 9.5,
            personality: isAr ? `الخيار المتاح ${idx + 1}` : `Available Option ${idx + 1}`,
          })));
          setCurrentOptionIndex(0);
          toast.success(isAr ? "تم توليد الجداول" : "Schedules generated");
        }
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error(isAr ? "حدث خطأ أثناء التوليد" : "Generation error");
    } finally {
      setIsGenerating(false);
      setGenerationStep('idle');
    }
  };

  const handleScreenshot = async () => {
    if (!scheduleRef.current) return;

    try {
      toast.info(isAr ? "جاري تجهيز الصورة..." : "Preparing image...");

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
      toast.loading(isAr ? "جاري حفظ وتصدير جدولك..." : "Saving and exporting your schedule...", { id: "save-schedule" });
      runSupabaseWithRetry(async () => await supabase.from('user_schedules').upsert({
        user_id: user.id,
        student_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
        student_email: user.email,
        schedule_data: itemsToSave,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' }), 3, 1000, isAr).then(({ error }) => {
        toast.dismiss("save-schedule");
        if (!error) {
          setShowSuccessOverlay(true);
        } else {
          console.error("Cloud sync error:", error);
          toast.error(isAr
            ? `فشلت المزامنة السحابية بعد محاولات متعددة: ${error.message}`
            : `Cloud sync failed after multiple retries: ${error.message}`
          );
        }
      });
    } else {
      setShowSuccessOverlay(true);
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
      const course = findCourseByIdOrCode(s.courseId);
      const instr = facultyList.find(f => f.id === s.instructorId);

      const daysStrAr = (s.days || []).map(d => dayNamesAr[d]).join(" - ");
      const daysStrEn = (s.days || []).map(d => dayNamesEn[d]).join(" - ");

      tableItems.push({
        ...s,
        courseName: course?.name,
        courseNameAr: course?.nameAr,
        instructor: s.instructorName || instr?.name, // Use database instructor name if available
        instructorAr: s.instructorName || instr?.nameAr,
        daysStrAr,
        daysStrEn,
      });

      (s.days || []).forEach(d => {
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
  }, [generatedSchedules, currentOptionIndex, dbCourses, dbSections]);

  const totalHours = activePlan.reduce((sum, c) => sum + c.hours, 0);

  // Real-time Form Validation
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (activePlan.length === 0) {
      errors.push(isAr ? "الرجاء اختيار مادة واحدة على الأقل لبدء التوليد." : "Please select at least one course.");
    }
    if (totalHours > maxHours) {
      errors.push(isAr
        ? `لقد تجاوزت الحد الأقصى للساعات المسموح بها (${maxHours} ساعة).`
        : `You have exceeded the maximum allowed hours (${maxHours}h).`
      );
    }
    if (totalHours > targetHours) {
      errors.push(isAr
        ? `لقد تجاوزت الساعات المستهدفة (${targetHours} ساعة). يرجى تعديل الساعات أو تقليل المواد.`
        : `You have exceeded the target hours (${targetHours}h). Please adjust the target hours or reduce courses.`
      );
    }
    if (totalHours < 1 && activePlan.length > 0) {
      errors.push(isAr
        ? "الحد الأدنى للساعات في الجدول هو ساعة واحدة أكاديمية."
        : "Minimum registration is 1 academic hour."
      );
    }
    return errors;
  }, [activePlan, totalHours, maxHours, targetHours, isAr]);

  const filteredSearch = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    
    return baseCourses.filter(c => {
      const nameAr = String(c?.nameAr || "").toLowerCase();
      const nameEn = String(c?.name || "").toLowerCase();
      const code = String(c?.code || "").toLowerCase();
      
      const matchesSearch = nameAr.includes(q) || nameEn.includes(q) || code.includes(q);
      const notInPlan = !activePlan.some(ap => ap.id === c.id);
      
      return matchesSearch && notInPlan;
    });
  }, [searchQuery, activePlan, baseCourses]);

  // UI Constants
  const BASE_ROW_HEIGHT = isMobile ? 42 : 75;
  const ROW_HEIGHT = BASE_ROW_HEIGHT * gridScale;
  const GRID_HEIGHT = (TIME_SLOTS.length + 1) * ROW_HEIGHT;

  const getCompatibilityLabel = (option: ScheduleOption) => {
    if (!option) return "";
    const daysCount = new Set(option.sections.flatMap(s => s.days)).size;
    const firstTime = option.sections.map(s => parseInt(s.startTime.split(':')[0])).sort((a, b) => a - b)[0];

    if (daysCount <= 3) return isAr ? `مضغوط: ${daysCount} أيام دوام` : `Intensive: ${daysCount} Days`;
    if (firstTime >= 10) return isAr ? "مريح: بداية متأخرة" : "Relaxed: Late Start";
    return isAr ? "متوازن: توزيع مثالي" : "Balanced: Perfect Spread";
  };

  if (loading || !user) {
    return <SchedulePlannerSkeleton />;
  }

  if (showExamPlanner) {
    return (
      <FeatureGate feature="exam_planner">
      <div className="container mx-auto px-4 pt-2 md:pt-6 pb-10 max-w-[1700px]">
        <PageHeader title={isAr ? "منسق جدول الامتحانات" : "Exam Schedule Planner"} subtitle={isAr ? "أنشئ خطة دراسة ذكية من جدول امتحاناتك." : "Build a smart study plan from your exam schedule."} icon={<Calendar className="w-8 h-8" />} />
        <ExamStudyPlanner />
        <button type="button" onClick={() => navigate("/schedule")} className="mx-auto mt-6 flex items-center gap-2 rounded-2xl border border-border/60 bg-surface/50 px-5 py-3 text-sm font-black text-muted-foreground hover:border-accent hover:text-accent transition-colors"><ChevronRight className="h-4 w-4 rtl:rotate-180" />{isAr ? "العودة إلى منسق جدول المواد" : "Back to course planner"}</button>
      </div>
      </FeatureGate>
    );
  }

  if (!hasFeatureAccess(siteSettings, "study_planner", user)) return null;

  return (
    <div className="container mx-auto px-4 pt-2 md:pt-6 pb-6 max-w-[1700px]">
      <PageHeader
        title={isAr ? "مخطط الجدولة الذكي" : "Smart Schedule Planner"}
        subtitle={isAr ? "صمم جدولك الدراسي بنقرة واحدة باستخدام الذكاء الاصطناعي بناءً على الخطة المعتمدة." : "Design your semester schedule in one click with AI based on your approved roadmap."}
        icon={<Calendar className="w-8 h-8" />}
      />
      <section className="relative mt-8 overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_10%_0%,rgba(20,184,166,0.16),transparent_35%),radial-gradient(circle_at_90%_100%,rgba(99,102,241,0.16),transparent_40%),#0b1220] p-5 shadow-2xl shadow-black/20 md:p-8 hidden">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mb-7 flex flex-col gap-4 text-center md:flex-row md:items-end md:justify-between md:text-right">
          <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[10px] font-black tracking-[0.16em] text-accent"><Sparkles className="h-3.5 w-3.5" />{isAr ? "منسقات ذكية للطلاب" : "SMART STUDENT PLANNERS"}</div><h2 className="text-2xl font-black text-white md:text-3xl">{isAr ? "اختر طريقك وابدأ الآن" : "Choose your path and start"}</h2><p className="mt-2 text-sm font-bold leading-6 text-slate-400">{isAr ? "كل منسق مصمم لمهمة مختلفة. اختر واحدًا فقط لتبقى تجربتك مركزة وواضحة." : "Each planner is designed for a different task. Choose one to keep your experience focused."}</p></div>
          <div className="mx-auto inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-bold text-slate-300 md:mx-0"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{isAr ? "جاهز لمساعدتك" : "Ready to help"}</div>
        </div>
        <div className="relative mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          <button type="button" aria-pressed={!showExamPlanner} onClick={() => { setShowExamPlanner(false); document.getElementById("course-schedule-builder")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={cn("group relative overflow-hidden rounded-[1.75rem] border p-5 text-right transition-all duration-300 hover:-translate-y-1", !showExamPlanner ? "border-accent/70 bg-gradient-to-br from-accent/20 to-cyan-400/5 shadow-lg shadow-accent/10" : "border-white/10 bg-white/[0.035] hover:border-accent/40 hover:bg-white/[0.06]")}>
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl transition-transform duration-500 group-hover:scale-150" /><div className="relative flex items-start justify-between gap-4"><div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border", !showExamPlanner ? "border-accent/30 bg-accent/20 text-accent" : "border-white/10 bg-white/5 text-slate-300")}><Brain className="h-7 w-7" /></div><span className={cn("rounded-full px-2.5 py-1 text-[10px] font-black", !showExamPlanner ? "bg-accent text-slate-950" : "bg-white/10 text-slate-400")}>{isAr ? "الأكثر استخدامًا" : "Most used"}</span></div><div className="relative mt-6"><h3 className="text-lg font-black text-white">{isAr ? "إنشاء جدول المواد بالذكاء الاصطناعي" : "Create course schedule with AI"}</h3><p className="mt-2 text-xs font-bold leading-5 text-slate-400">{isAr ? "نسّق الشعب والمواد، وقلّل التعارضات، واختر أفضل جدول دراسي." : "Arrange sections, reduce conflicts, and find the best semester schedule."}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-black text-accent">{isAr ? "ابدأ من هنا" : "Start here"}<ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" /></span></div>
          </button>
          {siteSettings.exam_study_planner_enabled !== "false" && <button type="button" aria-pressed={showExamPlanner} onClick={() => setShowExamPlanner(true)} className={cn("group relative overflow-hidden rounded-[1.75rem] border p-5 text-right transition-all duration-300 hover:-translate-y-1", showExamPlanner ? "border-indigo-400/70 bg-gradient-to-br from-indigo-500/20 to-violet-400/5 shadow-lg shadow-indigo-500/10" : "border-white/10 bg-white/[0.035] hover:border-indigo-400/40 hover:bg-white/[0.06]")}>
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-indigo-400/10 blur-2xl transition-transform duration-500 group-hover:scale-150" /><div className="relative flex items-start justify-between gap-4"><div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border", showExamPlanner ? "border-indigo-300/30 bg-indigo-400/20 text-indigo-200" : "border-white/10 bg-white/5 text-slate-300")}><Calendar className="h-7 w-7" /></div><span className={cn("rounded-full px-2.5 py-1 text-[10px] font-black", showExamPlanner ? "bg-indigo-300 text-indigo-950" : "bg-white/10 text-slate-400")}>{isAr ? "جديد" : "New"}</span></div><div className="relative mt-6"><h3 className="text-lg font-black text-white">{isAr ? "إنشاء جدول الامتحانات بالذكاء الاصطناعي" : "Create exam schedule with AI"}</h3><p className="mt-2 text-xs font-bold leading-5 text-slate-400">{isAr ? "حلّل صورة الامتحانات، وزّع ساعاتك، واستخدم مؤقت الدراسة والاستراحة." : "Analyze your exams, distribute study hours, and use the study-break timer."}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-black text-indigo-200">{isAr ? "افتح منسق الامتحانات" : "Open exam planner"}<ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" /></span></div>
          </button>}
        </div>
      </section>



      {/* NEW: Selected Courses & Controls Stack */}
      <div id="course-schedule-builder" className="mt-2 space-y-4">
        {/* 1. Selected Courses Strip */}
        <div className="rounded-2xl bg-[#0f1115] border border-white/5 shadow-xl w-full flex flex-col">
          {/* Mobile Toggle Header */}
          <button 
            onClick={() => setIsMobileCoursesOpen(!isMobileCoursesOpen)}
            className="w-full flex items-center justify-between sm:hidden p-3"
          >
             <span className="text-sm font-black text-white flex items-center gap-2">
               {isAr ? "المواد المسجلة" : "Selected Courses"} ({activePlan.length})
             </span>
             <ChevronDown className={cn("w-4 h-4 text-white/50 transition-transform", isMobileCoursesOpen && "rotate-180")} />
          </button>
          
          <div className={cn("flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 sm:p-4 min-h-[5rem] sm:min-h-[6rem] overflow-hidden", !isMobileCoursesOpen ? "hidden sm:flex" : "flex")}>
            <div className="hidden sm:flex flex-col items-center sm:items-start justify-center min-w-fit px-2 border-b sm:border-b-0 sm:border-l border-white/5 rtl:border-l-0 rtl:border-r sm:rtl:border-r pb-2 sm:pb-0 mb-1 sm:mb-0">
              <span className="text-xs sm:text-sm font-black text-white px-2">{isAr ? "المواد المسجلة" : "Selected Courses"} ({activePlan.length})</span>
            </div>

            <div className="flex-1 min-w-0 w-full overflow-x-auto custom-scrollbar flex gap-2 pb-2 sm:pb-0 items-stretch px-2" dir={isAr ? "rtl" : "ltr"}>
              {activePlan.map((course, idx) => {
                const colors = ["bg-purple-500/10 text-purple-400 border-purple-500/20", "bg-blue-500/10 text-blue-400 border-blue-500/20", "bg-amber-500/10 text-amber-400 border-amber-500/20", "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "bg-rose-500/10 text-rose-400 border-rose-500/20"];
                const color = colors[idx % colors.length];
                return (
                  <div key={course.id} className={`flex flex-col items-start rtl:items-end px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border w-[110px] sm:w-[150px] shrink-0 relative group ${color}`}>
                    <button onClick={() => toggleCourse(course)} className="absolute top-1 right-1 rtl:right-auto rtl:left-1 opacity-50 hover:opacity-100 hover:text-white transition-all bg-black/20 hover:bg-red-500/50 p-0.5 sm:p-1 rounded-md z-10">
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                    <span className="text-[9px] sm:text-[11px] font-black whitespace-normal line-clamp-2 sm:line-clamp-3 leading-tight text-right w-[85%] mb-1">{isAr ? course.nameAr : course.name}</span>
                    <div className="mt-auto pt-1 flex flex-col w-full">
                      <span className="text-[8px] sm:text-[10px] opacity-70 text-right w-full">{course.hours} {isAr ? "ساعات" : "hours"}</span>
                      <span className="text-[7px] sm:text-[9px] opacity-50 tracking-wider uppercase text-right w-full line-clamp-1">{course.code}</span>
                    </div>
                  </div>
                );
              })}
              {activePlan.length === 0 && (
                <div className="text-muted-foreground/50 text-xs font-bold py-2 px-4 italic mx-auto w-full text-center">
                  {isAr ? "لم يتم اختيار أي مواد بعد..." : "No courses selected yet..."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Add Courses Button */}
        <button onClick={() => setIsSelectionReviewOpen(true)} className="w-full text-sm sm:text-base text-[#5bb286] bg-[#5bb286]/10 hover:bg-[#5bb286]/20 py-3 sm:py-4 rounded-xl transition-colors flex items-center justify-center gap-2 font-black border border-[#5bb286]/20">
          <Plus className="w-5 h-5" />
          {isAr ? "إضافة مواد يدويا" : "Add Courses Manually"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 items-start">

        {/* Control Sidebar */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-3 sm:space-y-5 lg:order-1">
          <div className={cn(
            "p-4 sm:p-6 rounded-3xl sm:rounded-[2rem] bg-card/75 backdrop-blur-xl border border-border/60 shadow-elegant relative transition-all duration-200",
            isDaysDropdownOpen ? "z-30" : "z-10"
          )}>
            {/* Mobile Toggle Header */}
            <button 
              onClick={() => setIsMobileSettingsOpen(!isMobileSettingsOpen)}
              className="w-full flex items-center justify-between sm:hidden pb-1"
            >
               <span className="text-sm font-black text-foreground flex items-center gap-2">
                 <Brain className="w-4 h-4 text-accent" />
                 {isAr ? "إعدادات التفكير" : "AI Settings"}
               </span>
               <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isMobileSettingsOpen && "rotate-180")} />
            </button>
            <div className="hidden sm:flex items-center gap-2 pb-4 mb-4 border-b border-border/10">
                 <Brain className="w-5 h-5 text-accent" />
                 <span className="text-base font-black text-foreground">{isAr ? "إعدادات التفكير" : "AI Settings"}</span>
            </div>

            <div className={cn("space-y-3 sm:space-y-5 pt-3 sm:pt-0 border-t border-border/10 sm:border-0", !isMobileSettingsOpen && "hidden sm:block")}>
              {/* AI Strategy Selector & Generate Button - At Top */}
              {validationErrors.length > 0 && activePlan.length > 0 && (
                <div className="space-y-2 pb-3 sm:pb-5 border-b border-border/10">
                  {/* Real-time Form Validation Warnings */}
                  <div className="space-y-1.5 mb-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {validationErrors.map((err, i) => (
                      <div key={i} className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-black rounded-lg flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-black text-muted-foreground uppercase block px-1">{isAr ? "التخصص المعتمد" : "Selected Major"}</label>
                  <div className="w-full bg-accent/5 border border-accent/20 rounded-xl px-4 py-2.5 sm:px-5 sm:py-4 flex items-center justify-between group">
                    <span className="text-sm sm:text-base font-black text-accent">
                      {majors.find(m => m.id === selectedMajor)?.[isAr ? 'nameAr' : 'name'] || selectedMajor}
                    </span>
                    <button
                      onClick={() => navigate('/settings')}
                      className="text-[11px] sm:text-xs font-black text-muted-foreground hover:text-accent underline transition-colors"
                      aria-label={isAr ? "تغيير التخصص من إعدادات حسابك" : "Change major from your settings"}
                    >
                      {isAr ? "تغيير" : "Change"}
                    </button>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-bold px-1 italic">
                    {isAr ? "* يعتمد على إعدادات حسابك" : "* Based on your profile settings"}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-border/10">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm sm:text-base font-black text-foreground">{isAr ? "الساعات المستهدفة" : "Target Hours"}</span>
                    <span className="text-xl font-black text-accent">{targetHours}h</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={maxHours}
                    step="1"
                    value={targetHours}
                    onChange={(e) => setTargetHours(Number(e.target.value))}
                    className="w-full accent-accent h-2 bg-border/20 rounded-full cursor-pointer"
                    aria-label={isAr ? "شريط تمرير الساعات الدراسية المستهدفة لتسجيل المواد" : "Target academic hours registration slider"}
                  />
                </div>

                <div className="pt-3 border-t border-border/10 flex items-center justify-between px-1">
                  <div className={cn("flex flex-col", isAr ? "text-right" : "text-left")}>
                    <span className="text-sm font-black text-foreground">{isAr ? "تضمين الشعب المغلقة" : "Include Closed Sections"}</span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground font-bold leading-normal">
                      {isAr ? "توليد خيارات من الشعب المغلقة والمفتوحة معاً" : "Generate options using both open & closed sections"}
                    </span>
                  </div>
                  <button
                    onClick={() => setIncludeClosedSections(!includeClosedSections)}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0 flex items-center p-0.5 cursor-pointer",
                      includeClosedSections ? "bg-[#5bb286]" : "bg-border/40"
                    )}
                    role="switch"
                    aria-checked={includeClosedSections}
                    aria-label={isAr ? "تضمين الشعب المغلقة في توليد الجداول" : "Include closed sections in generation"}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 transform",
                        includeClosedSections ? (isAr ? "-translate-x-5" : "translate-x-5") : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/10">
                  <div className={cn("flex flex-col px-1", isAr ? "text-right" : "text-left")}>
                    <span className="text-sm font-black text-foreground">{isAr ? "أيام الدوام المفضلة" : "Preferred Study Days"}</span>
                    <span className="text-[10px] sm:text-[11px] text-muted-foreground font-bold leading-normal">
                      {isAr ? "اختر أياماً محددة للدوام أو استخدم الاختصارات السريعة" : "Select specific study days or use quick presets"}
                    </span>
                  </div>

                  {/* Trigger Dropdown Button (The "Answer") */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDaysDropdownOpen(!isDaysDropdownOpen)}
                      className="w-full bg-accent/5 border border-accent/20 hover:border-accent/40 rounded-xl px-4 py-3 flex items-center justify-between group transition-all duration-200 cursor-pointer text-right"
                      dir={isAr ? "rtl" : "ltr"}
                      aria-expanded={isDaysDropdownOpen}
                      aria-label={isAr ? "اختيار أيام الدوام المفضلة" : "Select preferred study days"}
                    >
                      <span className="text-sm font-black text-accent/90">
                        {isCustomMode && (isAr ? "أيام مخصصة..." : "Custom Days...")}
                        {!isCustomMode && activePreset === 'all' && (isAr ? "كل الأيام" : "All Days")}
                        {!isCustomMode && activePreset === 'sth' && (isAr ? "أحد / ثلاثاء / خميس" : "Sun / Tue / Thu")}
                        {!isCustomMode && activePreset === 'mw' && (isAr ? "اثنين / أربعاء" : "Mon / Wed")}
                        {!isCustomMode && activePreset === 'summer' && (isAr ? "أحد - أربعاء (الصيفي)" : "Sun - Wed (Summer)")}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted-foreground group-hover:text-accent transition-transform duration-300 shrink-0",
                          isDaysDropdownOpen && "rotate-180 text-accent"
                        )}
                      />
                    </button>

                    {/* Collapsible Dropdown List */}
                    <AnimatePresence>
                      {isDaysDropdownOpen && (
                        <>
                          {/* Backdrop overlay to close the dropdown when clicking outside */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsDaysDropdownOpen(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute left-0 right-0 mt-1.5 p-1.5 bg-[#09030a] border border-[#e63e6d]/30 rounded-2xl shadow-2xl z-20 flex flex-col gap-0.5"
                            dir={isAr ? "rtl" : "ltr"}
                          >
                            {[
                              { id: 'all', labelAr: "كل الأيام", labelEn: "All Days", descAr: "أحد، اثنين، ثلاثاء، أربعاء، خميس", descEn: "Sun, Mon, Tue, Wed, Thu" },
                              { id: 'sth', labelAr: "أحد / ثلاثاء / خميس", labelEn: "Sun / Tue / Thu", descAr: "محاضرات الأحد والثلاثاء والخميس", descEn: "Sunday, Tuesday, Thursday slots" },
                              { id: 'mw', labelAr: "اثنين / أربعاء", labelEn: "Mon / Wed", descAr: "محاضرات الاثنين والأربعاء", descEn: "Monday, Wednesday slots" },
                              { id: 'summer', labelAr: "أحد - أربعاء (الصيفي)", labelEn: "Sun - Wed (Summer)", descAr: "أيام الفصل الصيفي المعتمدة", descEn: "Summer semester standard days" },
                              { id: 'custom', labelAr: "أيام مخصصة...", labelEn: "Custom Days...", descAr: "تحديد أيام الدوام يدوياً بالتفصيل", descEn: "Select specific custom weekdays" }
                            ].map((opt) => {
                              const isActive = opt.id === 'custom' ? isCustomMode : (!isCustomMode && activePreset === opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    applyPreset(opt.id as any);
                                    setIsDaysDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-right px-3 py-2 rounded-xl transition-all duration-150 flex flex-col gap-0.5 cursor-pointer",
                                    isActive
                                      ? "bg-[#5bb286]/15 text-[#5bb286] font-black"
                                      : "hover:bg-white/5 text-foreground/80 hover:text-white"
                                  )}
                                  style={{ textAlign: isAr ? 'right' : 'left' }}
                                >
                                  <div className="flex justify-between items-center w-full">
                                    <span className={cn(
                                      "text-xs sm:text-sm font-black leading-snug",
                                      isActive ? "text-[#5bb286]" : "text-white"
                                    )}>
                                      {isAr ? opt.labelAr : opt.labelEn}
                                    </span>
                                    {isActive && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#5bb286] shrink-0" />}
                                  </div>
                                  <span className={cn(
                                    "text-[10px] sm:text-[11px] font-bold leading-snug",
                                    isActive ? "text-[#5bb286]/80" : "text-muted-foreground/70"
                                  )}>
                                    {isAr ? opt.descAr : opt.descEn}
                                  </span>
                                </button>
                              );
                            })}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>

                    {/* Collapsible Individual Day Squares */}
                    <AnimatePresence>
                      {isCustomMode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-5 gap-2 p-1.5 bg-accent/5 border border-accent/20 rounded-xl" dir={isAr ? "rtl" : "ltr"}>
                            {[
                              { id: 0, labelAr: "الأحد", labelEn: "Sun" },
                              { id: 1, labelAr: "الاثنين", labelEn: "Mon" },
                              { id: 2, labelAr: "الثلاثاء", labelEn: "Tue" },
                              { id: 3, labelAr: "الأربعاء", labelEn: "Wed" },
                              { id: 4, labelAr: "الخميس", labelEn: "Thu" }
                            ].map((day) => {
                              const isSelected = selectedDays.includes(day.id);
                              return (
                                <button
                                  key={day.id}
                                  type="button"
                                  onClick={() => toggleDay(day.id)}
                                  className={cn(
                                    "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 cursor-pointer border text-center",
                                    isSelected
                                      ? "bg-[#e63e6d]/15 border-[#e63e6d]/40 text-[#e63e6d] font-black shadow-[0_0_8px_rgba(230,62,109,0.15)]"
                                      : "bg-white/5 border-white/5 text-foreground/60 hover:text-white hover:bg-white/10 hover:border-white/10"
                                  )}
                                >
                                  <span className="text-[10px] sm:text-xs font-black">
                                    {isAr ? day.labelAr : day.labelEn}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || isDataLoading || (validationErrors.length > 0 && activePlan.length > 0)}
              className="bg-[#5bb286] hover:bg-[#4ea077] text-white rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 flex items-center justify-center gap-1.5 font-black text-sm sm:text-base shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 w-full border border-[#4ea077]/20"
              aria-label={isAr ? "توليد الخيارات المقترحة للجدول" : "Generate suggested schedule options"}
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isAr ? "توليد الجداول" : "Generate Schedules"}</span>
            </button>
          </div>

        </div>

        {/* Main Schedule Grid */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-4 lg:order-2">



          {generatedSchedules[currentOptionIndex] && findConflicts(generatedSchedules[currentOptionIndex].sections).length > 0 && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex flex-col">
                <span className="text-sm font-black text-red-500">{isAr ? "تنبيه: تضارب في المواعيد" : "Conflict Detected"}</span>
                <p className="text-xs font-bold text-red-500/70">
                  {isAr
                    ? `هناك تعارض بين: ${findConflicts(generatedSchedules[currentOptionIndex].sections).map(c =>
                      `${findCourseByIdOrCode(c.s1.courseId)?.nameAr} و ${findCourseByIdOrCode(c.s2.courseId)?.nameAr}`
                    ).join(" | ")}`
                    : "Some courses overlap in time."}
                </p>
              </div>
            </div>
          )}


{/* Missing Sections / Preferred Days Conflict / Time Conflict Warnings — handles all gracefully and explains the real reason to the student */}

          {/* ── STANDALONE Day-Conflict Warning (shows even when generation fails) ── */}
          {dayConflictedCourses.length > 0 && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 mb-2">
              <Calendar className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2 w-full" style={{ textAlign: isAr ? 'right' : 'left' }}>
                <span className="text-sm font-black text-rose-400">
                  {isAr
                    ? "⚠️ هذه المواد غير متاحة في أيامك المختارة"
                    : "⚠️ These courses aren't available on your selected days"}
                </span>
                <p className="text-xs font-bold text-rose-400/80 leading-relaxed">
                  {isAr
                    ? "الشعب المتاحة لهذه المواد تقع في أيام خارج نطاق اختيارك. إليك الأيام والأوقات المتاحة:"
                    : "Available sections fall outside your selected days. Here are the available days and times:"}
                </p>
                <div className="flex flex-col gap-3 mt-1">
                  {dayConflictedCourses.map((c: any) => {
                    const dayNamesAr: Record<number, string> = {
                      0: "الأحد", 1: "الاثنين", 2: "الثلاثاء", 3: "الأربعاء", 4: "الخميس", 5: "الجمعة", 6: "السبت"
                    };
                    const dayNamesEn: Record<number, string> = {
                      0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"
                    };
                    const timeDaysMap = new Map<string, Set<number>>();
                    c.courseSections.forEach((s: any) => {
                      if (!s.days || !s.startTime || !s.endTime) return;
                      const timeKey = `${s.startTime} - ${s.endTime}`;
                      if (!timeDaysMap.has(timeKey)) {
                        timeDaysMap.set(timeKey, new Set<number>());
                      }
                      s.days.forEach((d: number) => {
                        timeDaysMap.get(timeKey)!.add(d);
                      });
                    });
                    const sortedTimeSlots = Array.from(timeDaysMap.keys()).sort((a, b) => {
                      const startA = a.split(" - ")[0];
                      const startB = b.split(" - ")[0];
                      return startA.localeCompare(startB);
                    });
                    return (
                      <div key={c.id} className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 flex flex-col gap-1.5" style={{ textAlign: isAr ? 'right' : 'left' }}>
                        {sortedTimeSlots.map(timeKey => {
                          const days = Array.from(timeDaysMap.get(timeKey)!).sort((a, b) => a - b);
                          const daysStr = days.map(d => isAr ? dayNamesAr[d] : dayNamesEn[d]).join('/');
                          const lineStr = isAr
                            ? `[${c.nameAr || c.name}] يوم (${daysStr}) بالوقت [${timeKey}]`
                            : `[${c.name || c.nameAr}] on (${daysStr}) at [${timeKey}]`;
                          return (
                            <div key={timeKey} className="text-xs sm:text-sm font-bold text-rose-300/90 leading-relaxed text-right" dir={isAr ? "rtl" : "ltr"}>
                              {lineStr}
                              {c.code && (
                                <span className="text-[9px] font-bold text-rose-400/50 bg-rose-500/10 px-1 py-0.5 rounded ml-1.5 mr-1.5">
                                  {c.code}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] sm:text-[11px] text-rose-400/50 font-bold mt-1">
                  {isAr
                    ? "💡 اختر \"أيام مخصصة...\" وفعّل الأيام المناسبة لإضافة هذه المواد لجدولك."
                    : "💡 Choose \"Custom Days...\" and enable the matching days to include these courses."}
                </p>
              </div>
            </div>
          )}
          {(() => {
            const currentOpt = generatedSchedules[currentOptionIndex] as any;
            const unmatched: any[] = currentOpt?.unmatchedCourses ?? [];
            if (unmatched.length === 0) return null;

            const trulyMissing: any[] = [];
            const dayConflicted: any[] = [];
            const timeConflicted: any[] = [];

            unmatched.forEach((c: any) => {
              const courseSections = dbSections.filter(s =>
                s.courseId === c.id ||
                s.courseId === c.code ||
                (c.code && s.courseId &&
                  c.code.replace(/[\s-]/g, '').toUpperCase() === s.courseId.replace(/[\s-]/g, '').toUpperCase())
              );

              if (courseSections.length === 0) {
                trulyMissing.push(c);
              } else {
                // Group course sections by unique section
                const groups = new Map<string, any[]>();
                courseSections.forEach(s => {
                  const key = s.sectionNo ? `${s.courseId}_${s.sectionNo}` : s.id;
                  if (!groups.has(key)) groups.set(key, []);
                  groups.get(key)!.push(s);
                });

                // A section is valid under the current day selection if ALL its slots are on allowed days
                let hasAnySectionOnAllowedDays = false;
                groups.forEach((slots) => {
                  const allSlotsValid = slots.every(s => 
                    s.days && s.days.length > 0 && s.days.every(d => selectedDays.includes(d))
                  );
                  if (allSlotsValid) {
                    hasAnySectionOnAllowedDays = true;
                  }
                });

                if (hasAnySectionOnAllowedDays) {
                  timeConflicted.push(c);
                } else {
                  dayConflicted.push({
                    ...c,
                    courseSections
                  });
                }
              }
            });

            // Smart conflict resolver helper to show exactly which course overlaps
            const getConflictReason = (course: any, currentSections: any[]) => {
              const courseSections = dbSections.filter(s =>
                s.courseId === course.id ||
                s.courseId === course.code ||
                (course.code && s.courseId &&
                  course.code.replace(/[\s-]/g, '').toUpperCase() === s.courseId.replace(/[\s-]/g, '').toUpperCase())
              );

              if (courseSections.length === 0) return "";

              const conflicts: string[] = [];
              const dayNamesAr: Record<number, string> = {
                0: "الأحد",
                1: "الاثنين",
                2: "الثلاثاء",
                3: "الأربعاء",
                4: "الخميس"
              };
              const dayNamesEn: Record<number, string> = {
                0: "Sun",
                1: "Mon",
                2: "Tue",
                3: "Wed",
                4: "Thu"
              };

              courseSections.forEach(s => {
                currentSections.forEach(activeSec => {
                  const commonDays = s.days.filter(d => activeSec.days.includes(d));
                  if (commonDays.length > 0) {
                    const start1 = s.startTime.split(":").map(Number).reduce((h, m) => h * 60 + m);
                    const end1 = s.endTime.split(":").map(Number).reduce((h, m) => h * 60 + m);
                    const start2 = activeSec.startTime.split(":").map(Number).reduce((h, m) => h * 60 + m);
                    const end2 = activeSec.endTime.split(":").map(Number).reduce((h, m) => h * 60 + m);

                    if (start1 < end2 && start2 < end1) {
                      const activeCourse = dbCourses.find(dc => dc.id === activeSec.courseId || dc.code === activeSec.courseId);
                      const activeName = activeCourse ? (isAr ? activeCourse.nameAr : activeCourse.name) : activeSec.courseId;
                      const daysStr = commonDays.map(d => isAr ? dayNamesAr[d] : dayNamesEn[d]).join("/");
                      
                      const sectionNoStr = s.sectionNo || (s.id.includes('_') ? s.id.split('_')[1] : '1');
                      const conflictStr = isAr 
                        ? `شعبة ${sectionNoStr} تتعارض مع [${activeName}] يوم (${daysStr}) بالوقت [${s.startTime} - ${s.endTime}]`
                        : `Section ${sectionNoStr} conflicts with [${activeName}] on (${daysStr}) at [${s.startTime} - ${s.endTime}]`;

                      if (!conflicts.includes(conflictStr)) {
                        conflicts.push(conflictStr);
                      }
                    }
                  }
                });
              });

              return conflicts.join(" ، و ");
            };

            return (
              <div className="flex flex-col gap-3">
                {dayConflicted.length > 0 && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <Calendar className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-2 w-full text-right" style={{ textAlign: isAr ? 'right' : 'left' }}>
                      <span className="text-sm font-black text-rose-400">
                        {isAr
                          ? "⚠️ هذه المواد غير متاحة في أيامك المختارة"
                          : "⚠️ These courses aren't available on your selected days"}
                      </span>
                      <p className="text-xs font-bold text-rose-400/80 leading-relaxed">
                        {isAr
                          ? "الشعب المتاحة لهذه المواد تقع في أيام خارج نطاق اختيارك. إليك الأيام والأوقات المتاحة لكل مادة:"
                          : "Available sections for these courses fall on days outside your selection. Here are the available days and times:"}
                      </p>

                      <div className="flex flex-col gap-3 mt-1">
                        {dayConflicted.map((c: any) => {
                          const dayNamesAr: Record<number, string> = {
                            0: "الأحد", 1: "الاثنين", 2: "الثلاثاء", 3: "الأربعاء", 4: "الخميس", 5: "الجمعة", 6: "السبت"
                          };
                          const dayNamesEn: Record<number, string> = {
                            0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"
                          };
                          const timeDaysMap = new Map<string, Set<number>>();
                          c.courseSections.forEach((s: any) => {
                            if (!s.days || !s.startTime || !s.endTime) return;
                            const timeKey = `${s.startTime} - ${s.endTime}`;
                            if (!timeDaysMap.has(timeKey)) {
                              timeDaysMap.set(timeKey, new Set<number>());
                            }
                            s.days.forEach((d: number) => {
                              timeDaysMap.get(timeKey)!.add(d);
                            });
                          });
                          const sortedTimeSlots = Array.from(timeDaysMap.keys()).sort((a, b) => {
                            const startA = a.split(" - ")[0];
                            const startB = b.split(" - ")[0];
                            return startA.localeCompare(startB);
                          });
                          return (
                            <div key={c.id} className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 flex flex-col gap-1.5" style={{ textAlign: isAr ? 'right' : 'left' }}>
                              {sortedTimeSlots.map(timeKey => {
                                const days = Array.from(timeDaysMap.get(timeKey)!).sort((a, b) => a - b);
                                const daysStr = days.map(d => isAr ? dayNamesAr[d] : dayNamesEn[d]).join('/');
                                const lineStr = isAr
                                  ? `[${c.nameAr || c.name}] يوم (${daysStr}) بالوقت [${timeKey}]`
                                  : `[${c.name || c.nameAr}] on (${daysStr}) at [${timeKey}]`;
                                return (
                                  <div key={timeKey} className="text-xs sm:text-sm font-bold text-rose-300/90 leading-relaxed text-right" dir={isAr ? "rtl" : "ltr"}>
                                    {lineStr}
                                    {c.code && (
                                      <span className="text-[9px] font-bold text-rose-400/50 bg-rose-500/10 px-1 py-0.5 rounded ml-1.5 mr-1.5">
                                        {c.code}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-rose-400/50 font-bold mt-1">
                        {isAr
                          ? "💡 نصيحة: اختر \"أيام مخصصة...\" وفعّل الأيام المناسبة لإضافة هذه المواد لجدولك."
                          : "💡 Tip: Choose \"Custom Days...\" and enable the matching days to include these courses."}
                      </p>
                    </div>
                  </div>
                )}


                {timeConflicted.length > 0 && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1 w-full text-right" style={{ textAlign: isAr ? 'right' : 'left' }}>
                      <span className="text-sm font-black text-rose-400">
                        {isAr
                          ? "⚠️ تعارض في أوقات المحاضرات (Time Overlap)"
                          : "⚠️ Schedule Time Overlap"}
                      </span>
                      <p className="text-xs font-bold text-rose-400/80 leading-relaxed">
                        {isAr
                          ? `المواد التالية متوفرة في قاعدة البيانات ولكن تعذر إدراجها بالجدول لوجود تعارض في أوقاتها مع مواد أخرى بالجدول الحالي:`
                          : `The following courses are available in the database but could not be scheduled due to time conflicts with other courses in your current selection:`}
                      </p>
                      <ul className="list-disc list-inside text-[11px] font-bold text-rose-400/85 space-y-1.5 mt-1.5 mb-1.5 pr-2 rtl:pr-2 leading-relaxed">
                        {timeConflicted.map((c: any) => {
                          const reason = getConflictReason(c, currentOpt?.sections ?? []);
                          return (
                            <li key={c.id}>
                              <span className="text-white font-black underline decoration-rose-400/30 ml-1">{isAr ? c.nameAr : c.name}</span>
                              {reason ? ` ➔ ${reason}` : ""}
                            </li>
                          );
                        })}
                      </ul>
                      <p className="text-[11px] text-rose-400/50 font-bold">
                        {isAr
                          ? "* نصيحة: جرّب تعديل المواد المختارة أو تغيير خيارات الجدول (مثلاً النومجي، الفجري) لتجنب التعارض."
                          : "* Tip: Try choosing different courses or toggling schedule layouts (e.g. Early, Late) to resolve the overlap."}
                      </p>
                    </div>
                  </div>
                )}

                {trulyMissing.length > 0 && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-amber-400">
                        {isAr
                          ? "⚠️ مواد لا توجد لها شعب في قاعدة البيانات"
                          : "⚠️ Courses with no sections in database"}
                      </span>
                      <p className="text-xs font-bold text-amber-400/70 leading-relaxed">
                        {isAr
                          ? `المواد التالية لا تتوفر لها شعب مسجلة حالياً: ${trulyMissing.map((c: any) => c.nameAr || c.name).join(" ، ")}`
                          : `The following courses have no registered sections yet: ${trulyMissing.map((c: any) => c.name || c.nameAr).join(", ")}`}
                      </p>
                      <p className="text-[11px] text-amber-400/50 font-bold">
                        {isAr
                          ? "* يُرجى مراجعة إدارة القبول والتسجيل أو الانتظار حتى يتم إدخال الشعب."
                          : "* Please contact administration or wait until sections are registered."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}


          {/* Mobile Optimized Control Bar */}
          <div className="flex flex-row items-center justify-between p-2 sm:p-5 gap-2 bg-card/75 backdrop-blur-xl border border-border/60 rounded-[1rem] sm:rounded-[2rem] shadow-elegant mb-4 sm:mb-6 overflow-x-auto custom-scrollbar">
            
            {/* 1. Navigation (1/1) - Right Side in RTL */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 bg-background/50 border border-accent/20 rounded-lg sm:rounded-xl p-0.5 sm:p-1 shrink-0" dir="ltr">
              <button
                onClick={() => setCurrentOptionIndex(prev => Math.max(0, prev - 1))}
                className="p-1 sm:p-1.5 rounded-md hover:bg-surface transition-all disabled:opacity-20 text-accent"
                disabled={currentOptionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <span className="text-xs sm:text-lg font-black min-w-[3ch] sm:min-w-[4ch] text-center text-foreground">
                {currentOptionIndex + 1}/{Math.max(1, generatedSchedules.length)}
              </span>
              <button
                onClick={() => setCurrentOptionIndex(prev => Math.min(generatedSchedules.length - 1, prev + 1))}
                className="p-1 sm:p-1.5 rounded-md hover:bg-surface transition-all disabled:opacity-20 text-accent"
                disabled={currentOptionIndex >= generatedSchedules.length - 1}
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* AI Title - Hidden on mobile */}
            {generatedSchedules[currentOptionIndex]?.aiTitle && (
              <div className="hidden sm:flex flex-col border-x border-border/10 px-4 mx-2">
                <span className="text-xs font-black uppercase text-primary leading-none mb-1.5">{generatedSchedules[currentOptionIndex].aiTitle}</span>
                <p className="text-[11px] font-bold text-muted-foreground italic max-w-[500px] leading-relaxed">
                  "{generatedSchedules[currentOptionIndex].aiDescription}"
                </p>
              </div>
            )}

            {/* 2. Hours - Center */}
            <div className="flex flex-1 items-center justify-center gap-1 sm:flex-col mx-1 sm:mx-2 border-x border-border/10 px-2 sm:px-4">
              <span className="hidden sm:inline text-xs font-black uppercase text-muted-foreground">{isAr ? "الساعات:" : "HOURS:"}</span>
              <span className="text-sm sm:text-3xl font-black text-accent leading-none">
                <span className="sm:hidden text-[9px] text-muted-foreground ml-1 rtl:ml-0 rtl:mr-1">{isAr ? "ساعة:" : "H:"}</span>
                {generatedSchedules[currentOptionIndex]?.totalHours || 0}
              </span>
            </div>

            {/* 3. Actions & Camera - Left Side in RTL */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              
              

              

              {/* Download Image Button */}
              <button
                onClick={handleScreenshot}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent rounded-full text-[10px] sm:text-xs font-black hover:bg-accent hover:text-accent-foreground transition-all shadow-md active:scale-95 shrink-0"
              >
                <ImageDown className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span>{isAr ? "تحميل الصورة" : "Download Image"}</span>
              </button>

              {/* Export Button */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-foreground text-background rounded-full text-[10px] sm:text-sm font-black hover:opacity-90 transition-all shadow-md active:scale-95 shrink-0"
              >
                <Download className="w-3 h-3 sm:w-5 sm:h-5 shrink-0" />
                <span>{isAr ? "تصدير إلى جدولي" : "Export"}</span>
              </button>
            </div>
          </div>

          <div className="bg-card/75 backdrop-blur-xl border border-border/60 rounded-[2.5rem] shadow-elegant overflow-hidden relative">

            <div className="overflow-auto max-h-[1600px] custom-scrollbar relative z-10">
              {generatedSchedules.length > 0 ? (
                viewMode === "table" ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`table-${currentOptionIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-1 sm:p-4 md:p-6"
                    >
                      <div ref={scheduleRef} className="bg-[#f9f3d5] rounded-lg border-2 border-[#b0b0b0] shadow-md text-black font-sans relative overflow-hidden rtl:text-right max-w-full">
                        {/* Paper Header */}
                          <div className="bg-[#f9f3d5] pt-2 pb-1 px-3 sm:pt-3 sm:pb-2 sm:px-4 border-b-2 border-[#c0c0c0] flex items-center justify-end">
                            <img src="/rs.png" alt="Hadeed Logo" className="h-5 sm:h-7 w-auto object-contain" />
                          </div>

                          {/* Table Area */}
                        <div className="overflow-x-auto bg-[#f9f3d5] custom-scrollbar">
                          <table className="w-full min-w-[320px] border-collapse text-[10px] sm:text-[13px] font-bold text-[#333]">
                            <thead>
                              <tr className="bg-[#d9d9d9]">
                                <th className="border-t-0 border-b-2 border-r-2 border-l-0 last:border-r-0 rtl:border-l-2 rtl:border-r-0 rtl:last:border-l-0 border-[#a0a0a0] py-2 px-1 sm:py-3 sm:px-3 w-1/4 text-center text-[10px] sm:text-[13px] font-black">{isAr ? "اسم المادة" : "Course Name"}</th>
                                <th className="border-t-0 border-b-2 border-r-2 border-l-0 last:border-r-0 rtl:border-l-2 rtl:border-r-0 rtl:last:border-l-0 border-[#a0a0a0] py-2 px-1 sm:py-3 sm:px-3 w-1/3 text-center text-[10px] sm:text-[13px] font-black">{isAr ? "موعد المحاضرة" : "Lecture Time"}</th>
                                <th className="border-t-0 border-b-2 border-r-2 border-l-0 last:border-r-0 rtl:border-l-2 rtl:border-r-0 rtl:last:border-l-0 border-[#a0a0a0] py-2 px-1 sm:py-3 sm:px-3 w-1/5 text-center text-[10px] sm:text-[13px] font-black">{isAr ? "القاعة" : "Room"}</th>
                                <th className="border-t-0 border-b-2 border-r-0 border-l-0 border-[#a0a0a0] py-2 px-1 sm:py-3 sm:px-3 text-center text-[10px] sm:text-[13px] font-black">{isAr ? "المدرس" : "Instructor"}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                // Group flat tableItems by courseId or courseNameAr so multi-meeting slots show in a single row
                                const grouped = new Map<string, any[]>();
                                scheduleViews.tableItems.forEach((item: any) => {
                                  const key = item.courseId || item.courseNameAr;
                                  if (!grouped.has(key)) {
                                    grouped.set(key, []);
                                  }
                                  grouped.get(key)!.push(item);
                                });

                                return Array.from(grouped.values()).map((itemsList, idx) => {
                                  const firstItem = itemsList[0];
                                  return (
                                    <tr key={idx} className="hover:bg-[#f0e8c0] transition-colors border-b border-[#c0c0c0] last:border-b-0">
                                      {/* Course Name */}
                                      <td className="border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] py-2 px-1 sm:py-3 sm:px-2 text-center align-middle text-[10px] sm:text-[13px] leading-tight">
                                          <div className="flex flex-row items-center justify-center gap-1.5">
                                            <span className="font-bold">{isAr ? firstItem.courseNameAr : firstItem.courseName}</span>
                                            {isSectionClosed(firstItem) ? (
                                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/15 text-red-700 text-[8px] sm:text-[10px] font-black border border-red-500/30 whitespace-nowrap">
                                                {isAr ? "مغلقة" : "Closed"}
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 text-[8px] sm:text-[10px] font-black border border-emerald-500/30 whitespace-nowrap">
                                                {isAr ? "متاحة" : "Available"}
                                              </span>
                                            )}
                                          </div>
                                        </td>

                                      {/* Lecture Time */}
                                      <td className="border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] p-0 text-center leading-relaxed align-middle">
                                          <div className="flex flex-col h-full justify-stretch">
                                            {itemsList.map((item, sIdx) => (
                                              <div key={sIdx} className="border-b border-[#d0c690]/40 last:border-b-0 py-2 flex-1 flex flex-col justify-center min-h-[40px] sm:min-h-[50px]">
                                                <div className="mb-0.5 text-[9px] sm:text-[12px]">{isAr ? item.daysStrAr : item.daysStrEn}</div>
                                                <div className="text-[9px] sm:text-[12px] text-[#555] font-sans">{item.startTime} - {item.endTime}</div>
                                              </div>
                                            ))}
                                        </div>
                                      </td>

                                      {/* Room */}
                                      <td className="border-r rtl:border-l rtl:border-r-0 border-[#c0c0c0] p-0 text-center font-sans align-middle">
                                          <div className="flex flex-col h-full justify-stretch">
                                            {itemsList.map((item, sIdx) => (
                                              <div key={sIdx} className="border-b border-[#d0c690]/40 last:border-b-0 py-2 flex-1 flex items-center justify-center min-h-[40px] sm:min-h-[50px] text-[9px] sm:text-[12px]">
                                                {item.room}
                                              </div>
                                            ))}
                                        </div>
                                      </td>

                                      {/* Instructor */}
                                      <td className="p-0 text-center align-middle">
                                          <div className="flex flex-col h-full justify-stretch">
                                            {itemsList.map((item, sIdx) => (
                                              <div key={sIdx} className="border-b border-[#d0c690]/40 last:border-b-0 py-2 flex-1 flex items-center justify-center min-h-[40px] sm:min-h-[50px] text-[9px] sm:text-[12px] font-sans">
                                                {isAr ? item.instructorAr : item.instructor}
                                              </div>
                                            ))}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`grid-${currentOptionIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="relative p-2 sm:p-4"
                      style={{ height: `${GRID_HEIGHT}px`, minWidth: isMobile ? "400px" : "800px" }}
                    >
                      {/* Compatibility Tag for Grid View */}
                      <div className="absolute top-4 left-4 z-[50] flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-xl border border-accent/30 rounded-2xl shadow-xl shadow-accent/5">
                        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                        <span className="text-xs font-black text-accent uppercase tracking-wider">
                          {getCompatibilityLabel(generatedSchedules[currentOptionIndex])}
                        </span>
                      </div>
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
                                    <div className={cn(
                                      "h-full w-full rounded-xl sm:rounded-2xl shadow-md backdrop-blur-md p-1.5 sm:p-3 flex flex-col justify-between transition-all border-l-2 sm:border-l-4 overflow-hidden",
                                      isSectionClosed(item)
                                        ? "bg-red-500/10 border-red-500/30 border-l-red-500 group-hover:bg-red-500/20 group-hover:border-red-500/50 shadow-red-500/[0.02]"
                                        : "bg-accent/15 border-accent/30 border-l-accent group-hover:bg-accent/25 group-hover:border-accent/50 shadow-accent/[0.02]"
                                    )}>
                                      <div className="space-y-0.5 text-right">
                                        <div className="flex items-center justify-end gap-1 flex-wrap">
                                          {isSectionClosed(item) && (
                                            <span className="text-[7px] sm:text-[9px] font-black bg-red-500 text-white px-1 py-0.5 rounded shrink-0">
                                              {isAr ? "مغلقة" : "Closed"}
                                            </span>
                                          )}
                                          <h4 className="text-[9px] sm:text-xs font-black leading-tight text-foreground line-clamp-2">{isAr ? item.courseNameAr : item.courseName}</h4>
                                        </div>
                                        {!isMobile && (
                                          <div className="flex items-center justify-end gap-1.5 opacity-50">
                                            <span className="text-[10px] font-bold">{isAr ? item.instructorAr : item.instructor}</span>
                                            <User className="w-3 h-3" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-between mt-0.5 sm:mt-1">
                                        <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-black bg-surface/80 px-1 py-0.5 rounded-md border border-border/20">
                                          <MapPin className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3", isSectionClosed(item) ? "text-red-500" : "text-accent")} />
                                          <span>{item.room}</span>
                                        </div>
                                        <div className={cn("flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-black", isSectionClosed(item) ? "text-red-500" : "text-accent")}>
                                          <Clock className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3", isSectionClosed(item) ? "text-red-500" : "text-accent")} />
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
                    </motion.div>
                  </AnimatePresence>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-16 sm:py-40 px-6 sm:px-10 text-center space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                    <Calendar className="w-12 h-12 sm:w-20 sm:h-20 text-accent/40 relative z-10" />
                  </div>
                  <div className="space-y-1 sm:space-y-2 relative z-10">
                    <h3 className="text-base sm:text-2xl font-black opacity-40">{isAr ? "الجدول الأكاديمي سيظهر هنا" : "Academic Schedule View"}</h3>
                    <p className="text-xs sm:text-sm font-bold text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      {isAr ? "بعد اختيار موادك وضبط الإعدادات، سيقوم الذكاء الاصطناعي برسم جدولك في هذه المساحة الواسعة." : "After selecting your courses and settings, AI will render your optimized schedule in this wide space."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>

      </div>



      {/* Course Selection Modal */}
      <AnimatePresence>
        {isSelectionReviewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm" onClick={() => setIsSelectionReviewOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0f1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-4 flex items-center justify-between border-b border-white/10 bg-white/5">
                 <h2 className="text-lg font-black text-white">{isAr ? "إدارة المواد" : "Manage Courses"}</h2>
                 <button onClick={() => setIsSelectionReviewOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 rounded-3xl sm:rounded-[2rem] bg-card/75 backdrop-blur-xl border border-border/60 shadow-elegant flex flex-col min-h-[400px] sm:min-h-[500px]  overflow-y-auto custom-scrollbar">
            {/* Header Title */}
            <div className="space-y-1 mb-3 sm:mb-5 text-right px-1">
              <h3 className="text-sm sm:text-lg font-black text-foreground">{isAr ? "اختيار المواد" : "Course Selection"}</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-bold leading-normal">
                {isAr ? "اختر المواد المطلوبة ثم استعرض الشعب المتاحة لكل مادة." : "Select required courses then preview available sections for each course."}
              </p>
            </div>

            {/* ── COURSE SEARCH BOX ─────────────────────────────────── */}
            <div className="relative mb-3 sm:mb-5">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن مادة..." : "Search for a course..."}
                className="w-full bg-background/20 border border-border/20 focus:border-accent/40 focus:outline-none rounded-full pr-10 pl-4 py-2 sm:py-3 text-xs sm:text-sm font-black text-foreground placeholder:text-muted-foreground/30 transition-all text-right"
                aria-label={isAr ? "حقل البحث للبحث عن المواد المتاحة للتسجيل" : "Search input to find available courses"}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-surface text-muted-foreground hover:text-foreground transition-all"
                  aria-label={isAr ? "إلغاء عملية البحث ومسح النص" : "Clear search text"}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Collapsible Accordion Category List */}
            <div className="flex-1 overflow-y-auto space-y-2 md:space-y-4 px-0.5 custom-scrollbar mb-4">
              {categorizedCourses.map(category => {
                const isExpanded = !!expandedCategories[category.id];
                return (
                  <div key={category.id} className="border-b border-border/10 pb-2 md:pb-3.5 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between py-2 px-1 hover:bg-surface/10 rounded-lg transition-all"
                      aria-expanded={isExpanded}
                    >
                      {/* Left Side: count badge and chevron */}
                      <div className="flex items-center gap-2">
                        <span className="bg-muted text-muted-foreground text-xs font-black px-2 py-0.5 rounded-full shrink-0 min-w-[2.5ch] text-center">
                          {category.courses.length}
                        </span>
                        <ChevronLeft className={cn("w-3.5 h-3.5 text-muted-foreground/60 transition-transform shrink-0", isExpanded && "rotate-90 rtl:-rotate-90")} />
                      </div>

                      {/* Right Side: green block bullet + title */}
                      <div className="flex items-center gap-2 max-w-[80%]">
                        <span className="text-xs sm:text-base font-black text-foreground/90 text-right leading-tight">
                          {isAr ? category.nameAr : category.nameEn}
                        </span>
                        <div className="w-2.5 h-6 bg-[#5bb286] rounded-[4px] shrink-0" />
                      </div>
                    </button>

                    {/* expanded courses block */}
                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 md:space-y-2 animate-in fade-in slide-in-from-top-1 duration-200 pl-1 pr-4 rtl:pl-4 rtl:pr-1 border-r border-border/10 rtl:border-r-0 rtl:border-l">
                        {category.courses.map(course => {
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
                                "w-full p-2 sm:p-3.5 text-right rounded-xl border transition-all flex items-center justify-between group",
                                isSelected
                                  ? "bg-accent/15 border-accent shadow-sm"
                                  : "bg-surface border-border/30 hover:border-accent/40"
                              )}
                              aria-label={isSelected
                                ? (isAr ? `إلغاء اختيار مادة ${course.nameAr}` : `Unselect course ${course.name}`)
                                : (isAr ? `اختيار وإضافة مادة ${course.nameAr}` : `Select and add course ${course.name}`)
                              }
                            >
                              {isSelected ? (
                                <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center animate-in zoom-in duration-300">
                                  <Check className="w-2.5 h-2.5 text-accent-foreground" />
                                </div>
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100" />
                              )}
                              <div className="flex flex-col items-end">
                                <span className={cn("text-xs sm:text-sm font-black transition-colors leading-tight", isSelected ? "text-accent" : "text-foreground")}>
                                  {isAr ? course.nameAr : course.name}
                                </span>
                                <span className={cn("text-[9px] sm:text-xs font-bold transition-colors mt-0.5", isSelected ? "text-accent/60" : "text-muted-foreground")}>
                                  {course.code} • {course.hours}h
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Glassmorphic Success Overlay Modal */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="max-w-md w-full bg-card/60 border border-white/10 rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Mesh background glow */}
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

              {/* Animating success mark */}
              <div className="relative flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-24 h-24 rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center relative z-10 shadow-lg shadow-accent/10"
                >
                  <Check className="w-12 h-12 text-accent stroke-[3]" />
                </motion.div>

                {/* Pulsing ring */}
                <div className="absolute w-24 h-24 rounded-full bg-accent/5 border border-accent/20 animate-ping opacity-30" />
              </div>

              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-black text-foreground">
                  {isAr ? "تم حفظ الجدول بنجاح! 🎉" : "Schedule Saved Successfully! 🎉"}
                </h3>
                <p className="text-sm font-bold text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {isAr
                    ? "لقد تم تصدير جدولك الدراسي ومزامنته سحابياً بنجاح مع حسابك لتتمكن من الوصول إليه في أي وقت."
                    : "Your academic schedule has been exported and synced successfully to the cloud for real-time access."}
                </p>
              </div>

              <div className="pt-4 relative z-10 space-y-4">
                <div className="flex items-center justify-center gap-2 text-xs font-black text-accent bg-accent/10 py-2.5 px-4 rounded-xl border border-accent/20 max-w-[240px] mx-auto">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span>
                    {isAr
                      ? `جاري تحويلك تلقائياً خلال ${countdown} ثوانٍ...`
                      : `Redirecting automatically in ${countdown}s...`}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/my-schedule')}
                  className="text-sm font-black text-muted-foreground hover:text-accent underline transition-colors animate-pulse"
                >
                  {isAr ? "انتقل الآن يدوياً" : "Go manually now"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
