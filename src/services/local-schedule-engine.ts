/**
 * LOCAL SCHEDULE ENGINE - ZERO AI CREDITS - HIGH FIDELITY BACKTRACKING SEARCH
 * Generates conflict-free diverse schedules using real DB data with template-guided optimization.
 * Completely immune to null/undefined database time crashes.
 */

import { Course } from "@/data/mockData";
import { Section } from "@/data/sections";
import { majorCurriculum } from "@/data/majorsData";

export interface LocalScheduleSuggestion {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  tag: "relaxed" | "balanced" | "compressed" | "early" | "late" | "noGap";
  tagColor: string;
  tagEmoji: string;
  sections: Section[];
  courses: Course[];
  totalHours: number;
  studyDays: number;
  hasConflict: boolean;
  conflictCount: number;
  score: number;
  avgStartHour: number;
  longestGap: number;
  personality: string;
  unmatchedCourses: Course[];
  hasUnmatchedCourses: boolean;
}

type Intent = "relaxed" | "balanced" | "compressed";

// ─── DIVERSE TIME SLOT TEMPLATES ─────────────────────────────────────
const SCHEDULE_TEMPLATES = [
  { days: [0, 2, 4], startHour: 8, label: "أحد-ثلاثاء-خميس صبحاً", personality: "الفجري ⏰", tag: "early" as const },
  { days: [1, 3], startHour: 10, label: "اثنين-أربعاء", personality: "النومجي 😴", tag: "relaxed" as const },
  { days: [0, 2, 4], startHour: 12, label: "أحد-ثلاثاء-خميس بعد الظهر", personality: "المسائي 🌙", tag: "late" as const },
  { days: [1, 3], startHour: 8, label: "اثنين-أربعاء صبحاً", personality: "المبكر 🌅", tag: "early" as const },
  { days: [0, 1, 3, 4], startHour: 9, label: "4 أيام متوسط", personality: "المنظّم 📋", tag: "balanced" as const },
  { days: [2, 4], startHour: 8, label: "ثلاثاء-خميس مكثف", personality: "المضغوط ⚡", tag: "compressed" as const },
  { days: [0, 3, 4], startHour: 10, label: "أحد-أربعاء-خميس", personality: "المتوازن ⚖️", tag: "balanced" as const },
  { days: [1, 2, 4], startHour: 9, label: "اثنين-ثلاثاء-خميس", personality: "الديناميكي 🚀", tag: "balanced" as const },
];

const TAG_META: Record<string, { tag: LocalScheduleSuggestion["tag"]; tagColor: string; tagEmoji: string; titleAr: string; titleEn: string; descriptionAr: string; descriptionEn: string }> = {
  relaxed: { tag: "relaxed", tagColor: "from-emerald-500 to-teal-400", tagEmoji: "😌", titleAr: "مريح", titleEn: "Relaxed", descriptionAr: "بداية متأخرة وأيام قليلة، نوم كافي مضمون!", descriptionEn: "Late start, fewer days. Sleep in guaranteed!" },
  compressed: { tag: "compressed", tagColor: "from-violet-600 to-purple-500", tagEmoji: "⚡", titleAr: "مكثف", titleEn: "Compact", descriptionAr: "محاضرات متتالية، بتخلص بدري وترجع البيت!", descriptionEn: "Back-to-back, done early!" },
  early: { tag: "early", tagColor: "from-amber-500 to-orange-400", tagEmoji: "🌅", titleAr: "باكر", titleEn: "Early Bird", descriptionAr: "عشاق الصبح والطاقة الصبحية!", descriptionEn: "For the morning warriors." },
  late: { tag: "late", tagColor: "from-slate-500 to-blue-700", tagEmoji: "🌙", titleAr: "مسائي", titleEn: "Afternoon", descriptionAr: "الصبح حر بالكامل، كل شي بعد الظهر!", descriptionEn: "Mornings free, all afternoon." },
  noGap: { tag: "noGap", tagColor: "from-sky-500 to-cyan-400", tagEmoji: "🔗", titleAr: "بدون فراغات", titleEn: "No Gaps", descriptionAr: "جدول مترابط ما في وقت ضايع بين المحاضرات.", descriptionEn: "No wasted time between lectures." },
  balanced: { tag: "balanced", tagColor: "from-indigo-500 to-blue-500", tagEmoji: "⚖️", titleAr: "متوازن", titleEn: "Balanced", descriptionAr: "توزيع مثالي بين الراحة والدراسة.", descriptionEn: "Perfect balance of study and rest." },
};

// ─── Time Helpers with strict validation ──────────────────────────────
const timeToMins = (t: string | undefined | null): number => {
  if (!t || typeof t !== "string" || !t.includes(":")) return 480; // Default to 8:00 AM
  let [h, m] = t.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return 480;
  // Convert 12-hour format to 24-hour format if PM (classes run between 8:00 AM and 7:30 PM)
  if (h < 8) {
    h += 12;
  }
  return h * 60 + m;
};

const hasTimeOverlap = (s1: Section, s2: Section): boolean => {
  if (!s1.days || !s2.days) return false;
  const commonDays = s1.days.filter(d => s2.days.includes(d));
  if (commonDays.length === 0) return false;
  
  const a1 = timeToMins(s1.startTime), b1 = timeToMins(s1.endTime);
  const a2 = timeToMins(s2.startTime), b2 = timeToMins(s2.endTime);
  return a1 < b2 && a2 < b1;
};

// ─── Curriculum Courses Lookup ─────────────────────────────────────────
export const getCurriculumCourses = (
  major: string,
  year: number,
  semester: number,
  allCourses: Course[]
): Course[] => {
  const curriculum = majorCurriculum[major];
  if (!curriculum) return [];
  const yearPlan = curriculum.find(y => y.year === year);
  if (!yearPlan) return [];
  const semPlan = yearPlan.semesters.find(s => s.semester === semester);
  if (!semPlan) return [];
  return semPlan.courseIds
    .map(id => allCourses.find(c => c.id === id))
    .filter((c): c is Course => !!c);
};

// ─── Section Grouping helper ─────────────────────────────────────────
const groupCourseSections = (sections: Section[]): Map<string, Section[]> => {
  const groups = new Map<string, Section[]>();
  sections.forEach(s => {
    // If sectionNo is present, group by courseId + sectionNo
    // Otherwise, treat as its own independent group using id
    const key = s.sectionNo ? `${s.courseId}_${s.sectionNo}` : s.id;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(s);
  });
  return groups;
};

interface RawSolution {
  sections: Section[];
  omitted: Course[];
  conflictCount?: number;
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────
export const generateLocalSchedules = (
  major: string,
  year: number,
  semester: number,
  allCourses: Course[],
  dbSections: Section[],
  selectedCourses: Course[],
  intent: Intent = "balanced",
  options: {
    maxStudyDays?: number;
    minStartTime?: string;
    avoidTeachers?: string[];
    maxOptions?: number;
    includeClosed?: boolean;
  } = {}
): LocalScheduleSuggestion[] => {
  const { maxStudyDays = 5, avoidTeachers = [], maxOptions = 8 } = options;

  const courses = selectedCourses.length > 0
    ? selectedCourses
    : getCurriculumCourses(major, year, semester, allCourses);

  if (courses.length === 0) return [];

  // Filter sections with strict validation rules to prevent crashes on bad DB records
  const cleanSections = dbSections.filter(s => {
    if (!s.startTime || !s.endTime || !s.days || !Array.isArray(s.days) || s.days.length === 0) return false;
    if (!s.startTime.includes(":") || !s.endTime.includes(":")) return false;
    if (avoidTeachers.length > 0 && avoidTeachers.includes(s.instructorName || "")) return false;
    return true;
  });

  // Group sections by course
  const courseSectionGroups: { course: Course; groups: Section[][] }[] = [];
  const unmatchedCourses: Course[] = [];

  courses.forEach(c => {
    const courseSections = cleanSections.filter(s => 
      s.courseId === c.id || s.courseId === c.code ||
      (c.code && s.courseId && c.code.replace(/[\s-]/g, '').toUpperCase() === s.courseId.replace(/[\s-]/g, '').toUpperCase())
    );

    if (courseSections.length === 0) {
      unmatchedCourses.push(c);
    } else {
      const groupedMap = groupCourseSections(courseSections);
      // Sort groups so that open sections are tried first in backtracking (only if we want to prefer them)
      const sortedGroups = Array.from(groupedMap.values());
      if (!options.includeClosed) {
        sortedGroups.sort((a, b) => {
          const aClosed = a.some(s => {
            if (!s.status) return false;
            const statusStr = s.status.toString().trim();
            return statusStr === '0' || statusStr === '3' || statusStr === 'مغلقة' || statusStr.toLowerCase() === 'closed';
          });
          const bClosed = b.some(s => {
            if (!s.status) return false;
            const statusStr = s.status.toString().trim();
            return statusStr === '0' || statusStr === '3' || statusStr === 'مغلقة' || statusStr.toLowerCase() === 'closed';
          });
          if (aClosed && !bClosed) return 1;
          if (!aClosed && bClosed) return -1;
          return 0;
        });
      }

      courseSectionGroups.push({
        course: c,
        groups: sortedGroups
      });
    }
  });

  if (courseSectionGroups.length === 0) return [];

  // ─── BACKTRACKING ENGINE ───
  // ─── BACKTRACKING PASS 1: Conflict-free combinations (possibly omitting some courses) ───
  const solutionsByCount: Record<number, RawSolution[]> = {};
  let bestCourseCount = 0;
  let backtrackAttempts = 0;
  const MAX_ATTEMPTS = 5000;

  const backtrack = (index: number, currentSections: Section[], currentCourseCount: number, omittedCourses: Course[]) => {
    backtrackAttempts++;
    if (backtrackAttempts > MAX_ATTEMPTS || (solutionsByCount[bestCourseCount]?.length || 0) >= 300) return;

    if (index === courseSectionGroups.length) {
      if (currentCourseCount > 0) {
        if (!solutionsByCount[currentCourseCount]) {
          solutionsByCount[currentCourseCount] = [];
        }
        solutionsByCount[currentCourseCount].push({
          sections: [...currentSections],
          omitted: [...omittedCourses],
          conflictCount: 0
        });
        if (currentCourseCount > bestCourseCount) {
          bestCourseCount = currentCourseCount;
        }
      }
      return;
    }

    const { course, groups } = courseSectionGroups[index];

    // Branch 1: Try placing the course (each of its groups)
    let placed = false;
    for (const group of groups) {
      const hasConflict = group.some(s1 => 
        currentSections.some(s2 => hasTimeOverlap(s1, s2))
      );

      if (!hasConflict) {
        placed = true;
        currentSections.push(...group);
        backtrack(index + 1, currentSections, currentCourseCount + 1, omittedCourses);
        for (let i = 0; i < group.length; i++) {
          currentSections.pop();
        }
      }
    }

    // Branch 2: Branch by skipping this course (enables sub-optimal completeness when conflicts exist)
    omittedCourses.push(course);
    backtrack(index + 1, currentSections, currentCourseCount, omittedCourses);
    omittedCourses.pop();
  };

  backtrack(0, [], 0, []);

  const rawSolutions: RawSolution[] = solutionsByCount[bestCourseCount] || [];

  // Deduplicate raw solutions
  const uniqueRawSolutions: RawSolution[] = [];
  const seenRawHashes = new Set<string>();

  for (const sol of rawSolutions) {
    const hash = sol.sections.map(s => s.id).sort().join(',');
    if (!seenRawHashes.has(hash)) {
      uniqueRawSolutions.push({ ...sol, conflictCount: 0 });
      seenRawHashes.add(hash);
    }
  }

  // ─── TEMPLATE-GUIDED SELECTION ───
  // Evaluates every unique schedule against our 8 templates and scores them to find best fits
  const finalSuggestions: LocalScheduleSuggestion[] = [];
  const chosenSolutionHashes = new Set<string>();

  // Helper to construct the dynamic conflict reason message in Arabic and English
  const getConflictResolutionMessage = (
    solSections: Section[],
    omittedCourses: Course[],
    unmatchedCourses: Course[]
  ): { descriptionAr: string; descriptionEn: string } => {
    const allOmitted = [...unmatchedCourses, ...omittedCourses];
    if (allOmitted.length === 0) {
      return {
        descriptionAr: "جدول متكامل يحتوي على كافة المواد وخالٍ تماماً من التعارض عن طريق تبديل الشعب!",
        descriptionEn: "A complete conflict-free schedule containing all selected courses by swapping sections!"
      };
    }

    // Find scheduled courses in this solution
    const scheduledCoursesWithSections: { course: Course; sections: Section[] }[] = [];
    courseSectionGroups.forEach(cg => {
      const scheduledSecs = solSections.filter(s => 
        s.courseId === cg.course.id || s.courseId === cg.course.code ||
        (cg.course.code && s.courseId && cg.course.code.replace(/[\s-]/g, '').toUpperCase() === s.courseId.replace(/[\s-]/g, '').toUpperCase())
      );
      if (scheduledSecs.length > 0) {
        scheduledCoursesWithSections.push({ course: cg.course, sections: scheduledSecs });
      }
    });

    const scheduledNamesAr = scheduledCoursesWithSections.map(sc => `[${sc.course.nameAr || sc.course.name}]`).join(" و ");
    const scheduledNamesEn = scheduledCoursesWithSections.map(sc => `[${sc.course.name || sc.course.nameAr}]`).join(" and ");

    const reasonsAr: string[] = [];
    const reasonsEn: string[] = [];

    omittedCourses.forEach(omitted => {
      const omittedGroup = courseSectionGroups.find(cg => cg.course.id === omitted.id);
      if (!omittedGroup) return;

      const conflictingScheduledCourses = new Set<Course>();

      for (const group of omittedGroup.groups) {
        for (const s1 of group) {
          for (const sc of scheduledCoursesWithSections) {
            const overlaps = sc.sections.some(s2 => hasTimeOverlap(s1, s2));
            if (overlaps) {
              conflictingScheduledCourses.add(sc.course);
            }
          }
        }
      }

      const conflictList = Array.from(conflictingScheduledCourses);
      if (conflictList.length > 0) {
        const conflictNamesAr = conflictList.map(c => `[${c.nameAr || c.name}]`).join(" و ");
        const conflictNamesEn = conflictList.map(c => `[${c.name || c.nameAr}]`).join(" and ");
        reasonsAr.push(`تم تأجيل [${omitted.nameAr || omitted.name}] لوجود تعارض مع ${conflictNamesAr}`);
        reasonsEn.push(`Deferred [${omitted.name || omitted.nameAr}] due to overlap with ${conflictNamesEn}`);
      } else {
        reasonsAr.push(`تم تأجيل [${omitted.nameAr || omitted.name}] لعدم توفر شعب متوافقة`);
        reasonsEn.push(`Deferred [${omitted.name || omitted.nameAr}] due to no compatible sections`);
      }
    });

    unmatchedCourses.forEach(unmatched => {
      reasonsAr.push(`تم تأجيل [${unmatched.nameAr || unmatched.name}] لعدم توفر شعب مطروحة في الفصل`);
      reasonsEn.push(`Deferred [${unmatched.name || unmatched.nameAr}] because it has no sections offered this semester`);
    });

    const descriptionAr = `💡 تم وضع ${scheduledNamesAr} وتأجيل مواد التعارض: ${reasonsAr.join("؛ و")}.`;
    const descriptionEn = `💡 Scheduled ${scheduledNamesEn} and deferred conflicting courses: ${reasonsEn.join("; and ")}.`;

    return { descriptionAr, descriptionEn };
  };

  const mergedCandidates: RawSolution[] = uniqueRawSolutions;

  for (let tIdx = 0; tIdx < SCHEDULE_TEMPLATES.length; tIdx++) {
    const template = SCHEDULE_TEMPLATES[tIdx];
    if (template.days.length > maxStudyDays) continue;

    const scoredSolutions = mergedCandidates.map(sol => {
      const { sections, conflictCount = 0 } = sol;
      const sectionDays = new Set(sections.flatMap(s => s.days));

      // 1. Day Match Score: reward sitting on template days, penalize extra days
      let dayMatchScore = 100;
      sectionDays.forEach(d => {
        if (!template.days.includes(d)) {
          dayMatchScore -= 40; 
        }
      });

      // 2. Start Hour Match Score: reward starting closer to preferred hour
      const avgStart = sections.reduce((a, s) => a + timeToMins(s.startTime), 0) / sections.length / 60;
      const hourDiff = Math.abs(avgStart - template.startHour);
      const hourMatchScore = 100 - (hourDiff * 15);

      // 3. Gap Score evaluation
      const dayMap: Record<number, Section[]> = {};
      sections.forEach(s => s.days.forEach(d => {
        if (!dayMap[d]) dayMap[d] = [];
        dayMap[d].push(s);
      }));

      let longestGap = 0;
      Object.values(dayMap).forEach(ds => {
        const sorted = [...ds].sort((a, b) => timeToMins(a.startTime) - timeToMins(b.startTime));
        for (let i = 1; i < sorted.length; i++) {
          const g = timeToMins(sorted[i].startTime) - timeToMins(sorted[i - 1].endTime);
          if (g > 0) longestGap = Math.max(longestGap, g);
        }
      });

      let gapScore = 0;
      if (intent === "compressed") {
        gapScore = -longestGap / 10;
      } else if (intent === "relaxed") {
        gapScore = longestGap / 20;
      }

      // 4. Penalties for conflicts & skipped courses
      const conflictPenalty = conflictCount * 250;
      const omittedPenalty = (sol.omitted ? sol.omitted.length : 0) * 150;

      const totalScore = dayMatchScore + hourMatchScore + gapScore - conflictPenalty - omittedPenalty;

      return {
        sol,
        score: totalScore,
        avgStartHour: avgStart,
        longestGap,
        studyDays: sectionDays.size,
        conflictCount
      };
    });

    // Sort scored solutions descending
    scoredSolutions.sort((a, b) => b.score - a.score);

    // Pick the best fitting solution that hasn't been chosen yet for other templates (deduplication)
    let selected = scoredSolutions.find(ss => {
      const hash = ss.sol.sections.map(s => s.id).sort().join(',');
      return !chosenSolutionHashes.has(hash);
    });

    // Fallback if all solutions were already assigned to other templates
    if (!selected && scoredSolutions.length > 0) {
      selected = scoredSolutions[0];
    }

    if (selected) {
      const { sol, avgStartHour, longestGap, studyDays, conflictCount } = selected;
      const hash = sol.sections.map(s => s.id).sort().join(',');
      chosenSolutionHashes.add(hash);

      const meta = TAG_META[template.tag] || TAG_META.balanced;

      // Extract unique courses in the suggestion
      const sectionCourses = sol.sections.map(s =>
        allCourses.find(c => c.id === s.courseId || c.code === s.courseId)
      ).filter((c): c is Course => !!c);

      const seenCourseIds = new Set<string>();
      const uniqueCourses = sectionCourses.filter(c => {
        if (seenCourseIds.has(c.id)) return false;
        seenCourseIds.add(c.id);
        return true;
      });
      const totalHours = uniqueCourses.reduce((sum, c) => sum + c.hours, 0);

      // Merge initial unmatched (courses with zero sections in DB) and skipped courses
      const mergedUnmatched = [...unmatchedCourses, ...(sol.omitted || [])];
      const seenUnmatched = new Set<string>();
      const uniqueUnmatched = mergedUnmatched.filter(c => {
        if (seenUnmatched.has(c.id)) return false;
        seenUnmatched.add(c.id);
        return true;
      });

      const isConflictFree = conflictCount === 0;
      const isComplete = (sol.omitted || []).length === 0;

      let titleAr = `${meta.titleAr} - ${template.personality}`;
      let titleEn = `${meta.titleEn} - ${template.label}`;
      let descriptionAr = meta.descriptionAr;
      let descriptionEn = meta.descriptionEn;
      let tagColor = meta.tagColor;
      let tagEmoji = meta.tagEmoji;

      if (!isComplete) {
        titleAr = `💡 خيار بديل (حل التعارض) - ${template.personality}`;
        titleEn = `💡 Alternative Option (Conflict Resolved) - ${template.personality}`;
        const resolution = getConflictResolutionMessage(sol.sections, sol.omitted || [], unmatchedCourses);
        descriptionAr = resolution.descriptionAr;
        descriptionEn = resolution.descriptionEn;
        tagColor = "from-amber-500 to-orange-400";
        tagEmoji = "💡";
      } else {
        titleAr = `✅ ${meta.titleAr} (متكامل) - ${template.personality}`;
        titleEn = `✅ ${meta.titleEn} (Complete) - ${template.label}`;
        descriptionAr = `جدول متكامل يحتوي على كافة المواد وخالٍ تماماً من التعارض عن طريق تبديل الشعب!`;
        descriptionEn = `A complete conflict-free schedule containing all selected courses by swapping sections!`;
      }

      finalSuggestions.push({
        id: `sched-t${tIdx}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        tag: template.tag,
        tagColor,
        tagEmoji,
        sections: sol.sections,
        courses: uniqueCourses,
        totalHours,
        studyDays,
        hasConflict: !isConflictFree,
        conflictCount,
        score: selected.score,
        avgStartHour,
        longestGap,
        personality: template.personality,
        unmatchedCourses: uniqueUnmatched,
        hasUnmatchedCourses: uniqueUnmatched.length > 0
      });
    }
  }

  // Sort final suggestions by score descending
  const sortedSuggestions = finalSuggestions.sort((a, b) => b.score - a.score);

  return sortedSuggestions;
};


