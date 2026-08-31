import { RoadmapNode } from "../data/roadmapData";
import { Section } from "../data/sections";
import { Course } from "../data/mockData";

export interface ScheduleOption {
  sections: Section[];
  totalHours: number;
  aiTitle?: string;
  aiDescription?: string;
  isAI?: boolean;
  // Fields populated by the local schedule engine
  tag?: string;
  tagColor?: string;
  tagEmoji?: string;
  studyDays?: number;
  avgStartHour?: number;
  personality?: string;
  unmatchedCourses?: any[];
  hasUnmatchedCourses?: boolean;
  hasConflict?: boolean;
  conflictCount?: number;
}

/**
 * Converts a time string (HH:MM) to minutes from midnight
 */
export const timeToMinutes = (time: string | undefined | null): number => {
  if (!time || typeof time !== "string" || !time.includes(":")) return 480; // 8:00 AM default
  let [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return 480;
  // Convert 12-hour format to 24-hour format if PM (classes run between 8:00 AM and 7:30 PM)
  if (hours < 8) {
    hours += 12;
  }
  return hours * 60 + minutes;
};

/**
 * Checks if two sections overlap in time
 */
export const hasOverlap = (s1: Section, s2: Section): boolean => {
  const commonDays = s1.days.filter(d => s2.days.includes(d));
  if (commonDays.length === 0) return false;

  const start1 = timeToMinutes(s1.startTime);
  const end1 = timeToMinutes(s1.endTime);
  const start2 = timeToMinutes(s2.startTime);
  const end2 = timeToMinutes(s2.endTime);

  return (start1 < end2 && start2 < end1);
};

/**
 * The core logic to filter courses based on the intersection of Roadmap and Sections
 */
export const getSuggestedCourses = (
  major: string,
  level: number,
  roadmap: RoadmapNode[],
  allCourses: Course[],
  availableSections: Section[],
  targetHours: number
): Course[] => {
  // 1. Get roadmap nodes for this major and common ones
  const categoryMap: Record<string, string> = {
    "electrical_computer": "electrical",
    "computer": "computer",
    "civil": "civil",
    "mechatronics": "mechatronics",
    "mechanical": "mechanical",
    "chemical": "chemical",
    "autotronics": "mechanical"
  };

  const targetCategory = categoryMap[major] || major;
  const majorNodes = roadmap.filter(n => n.category === targetCategory || n.category === "common");

  // 2. Identify which roadmap courses actually have sections available
  const availableCourseIds = new Set(availableSections.map(s => s.courseId));
  const planNodesWithSections = majorNodes.filter(n => availableCourseIds.has(n.id));

  // 3. Filter by level and prioritize
  const exactLevelNodes = planNodesWithSections.filter(n => n.level === level);

  const selectedCourses: Course[] = [];
  let currentTotal = 0;

  // Add from exact level first
  for (const node of exactLevelNodes) {
    const course = allCourses.find(c => c.id === node.id);
    if (course && currentTotal + course.hours <= targetHours) {
      selectedCourses.push(course);
      currentTotal += course.hours;
    }
  }

  // 4. Fallback: If still under target hours, add any courses from the same department
  if (currentTotal < targetHours) {
    const deptMap: Record<string, string[]> = {
      "computer": ["هندسة الحاسوب", "Computer Engineering", "Network Security"],
      "civil": ["الهندسة المدنية", "Civil Engineering"],
      "mechanical": ["الهندسة الميكانيكية", "Mechanical Engineering"],
      "electrical": ["الهندسة الكهربائية", "Electrical Engineering"],
      "chemical": ["الهندسة الكيميائية", "Chemical Engineering"],
      "mechatronics": ["هندسة الميكاترونكس", "Mechatronics Engineering"],
      "renewable": ["هندسة الطاقة المتجددة", "Renewable Energy"],
    };

    const targetDepts = deptMap[major] || [];
    const deptCourses = allCourses.filter(c =>
      targetDepts.some(d => c.department.includes(d)) &&
      availableCourseIds.has(c.id) &&
      !selectedCourses.find(sc => sc.id === c.id)
    );

    for (const course of deptCourses) {
      if (currentTotal + course.hours <= targetHours) {
        selectedCourses.push(course);
        currentTotal += course.hours;
      }
    }
  }

  // 5. Final Fallback: Common courses (General)
  if (currentTotal < targetHours) {
    const generalCourses = allCourses.filter(c =>
      (c.department === "General" || c.department === "متطلبات عامة") &&
      availableCourseIds.has(c.id) &&
      !selectedCourses.find(sc => sc.id === c.id)
    );

    for (const course of generalCourses) {
      if (currentTotal + course.hours <= targetHours) {
        selectedCourses.push(course);
        currentTotal += course.hours;
      }
    }
  }

  return selectedCourses;
};

/**
 * Generates all possible conflict-free schedule combinations
 */
export const generateSchedules = (
  selectedCourses: Course[],
  allSections: Section[],
  maxOptions: number = 12,
  avoidTeachers: string[] = [],
  blockedSlots: { day: number, start: string, end: string }[] = [],
  maxStudyDays: number = 5,
  minStartTime: string = "08:00",
  includeClosed: boolean = false
): Section[][] => {
  if (selectedCourses.length === 0) return [];

  // Helper to shuffle array
  const shuffle = <T>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const filteredSections = allSections.filter(s => {
    // 0. Safety Guard: validate time and days formatting to prevent runtime crashes
    if (!s.startTime || !s.endTime || !s.days || !Array.isArray(s.days) || s.days.length === 0) return false;
    if (!s.startTime.includes(":") || !s.endTime.includes(":")) return false;

    // 1. Avoid Teachers
    if (avoidTeachers.length > 0) {
      if (
        avoidTeachers.includes(s.instructorName || '')
      ) return false;
    }
    // 2. Blocked Slots
    if (blockedSlots.length > 0) {
      const isBlocked = blockedSlots.some(bs => {
        const dayMatch = s.days.includes(bs.day);
        if (!dayMatch) return false;
        
        const [sStartH, sStartM] = s.startTime.split(':').map(Number);
        const [sEndH, sEndM] = s.endTime.split(':').map(Number);
        const sStart = sStartH * 60 + sStartM;
        const sEnd = sEndH * 60 + sEndM;
        
        const [bStartH, bStartM] = bs.start.split(':').map(Number);
        const [bEndH, bEndM] = bs.end.split(':').map(Number);
        const bStart = bStartH * 60 + bStartM;
        const bEnd = bEndH * 60 + bEndM;
        
        return (sStart < bEnd && sEnd > bStart);
      });
      if (isBlocked) return false;
    }

    // 3. Min Start Time
    const [minH, minM] = minStartTime.split(':').map(Number);
    const minTotal = minH * 60 + minM;
    const [sStartH, sStartM] = s.startTime.split(':').map(Number);
    const sStartTotal = sStartH * 60 + sStartM;
    if (sStartTotal < minTotal) return false;

    return true;
  });

  const shuffledCourses = shuffle(selectedCourses);
  const courseSections: Section[][][] = shuffledCourses.map(c => {
    const sectionsForCourse = filteredSections.filter(s => s.courseId === c.id || s.courseId === c.code);
    
    // Group by logical section ID (courseId + sectionNo)
    const groupsMap = new Map<string, Section[]>();
    sectionsForCourse.forEach(s => {
      const groupId = s.id.split('_').slice(0, 2).join('_');
      if (!groupsMap.has(groupId)) {
        groupsMap.set(groupId, []);
      }
      groupsMap.get(groupId)!.push(s);
    });
    
    const shuffledGroups = shuffle(Array.from(groupsMap.values()));
    // Sort so that groups containing closed sections are tried last (only if not including closed sections)
    if (!includeClosed) {
      return shuffledGroups.sort((a, b) => {
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
    return shuffledGroups;
  }).filter(groups => groups.length > 0);

  if (courseSections.length === 0) return [];

  const results: Section[][] = [];
  const maxAttempts = 1000; // Prevent infinite loops or extreme recursion
  let attempts = 0;

  const backtrack = (index: number, current: Section[]) => {
    attempts++;
    if (results.length >= 30 || attempts > maxAttempts) return;
    
    if (index === courseSections.length) {
      results.push([...current]);
      return;
    }

    // Try finding conflict-free group
    let conflictFreeFound = false;
    
    for (const group of courseSections[index]) {
      const conflict = group.some(sec1 => 
        current.some(sec2 => hasOverlap(sec1, sec2))
      );
      
      if (!conflict) {
        conflictFreeFound = true;
        current.push(...group);
        backtrack(index + 1, current);
        if (results.length >= 30) return;
        for (let k = 0; k < group.length; k++) {
          current.pop();
        }
      }
    }

    // VARIETY: If we can't find a conflict-free group, we still want to finish the schedule
    // but we prioritize non-conflicting paths.
    if (!conflictFreeFound && courseSections[index].length > 0) {
      const randomGroup = courseSections[index][Math.floor(Math.random() * courseSections[index].length)];
      current.push(...randomGroup);
      backtrack(index + 1, current);
      for (let k = 0; k < randomGroup.length; k++) {
        current.pop();
      }
    }
  };

  backtrack(0, []);
  
  // Sort results by conflict count (prefer fewer conflicts)
  // and filter by maxStudyDays
  const validResults = results.filter(opt => {
    const days = new Set(opt.flatMap(s => s.days));
    return days.size <= maxStudyDays;
  });

  const sortedResults = validResults.sort((a, b) => {
    const conflictsA = findConflicts(a).length;
    const conflictsB = findConflicts(b).length;
    return conflictsA - conflictsB;
  });

  // SHUFFLE the results to ensure that even if they are similar, the order is diverse
  const uniqueResults: Section[][] = [];
  const seenHashes = new Set<string>();

  for (const res of sortedResults) {
    const hash = res.map(s => s.id).sort().join(',');
    if (!seenHashes.has(hash)) {
      uniqueResults.push(res);
      seenHashes.add(hash);
    }
    if (uniqueResults.length >= maxOptions) break;
  }

  return shuffle(uniqueResults);
};

/**
 * Finds all overlapping section pairs in a schedule
 */
export const findConflicts = (sections: Section[]): {s1: Section, s2: Section}[] => {
  const conflicts: {s1: Section, s2: Section}[] = [];
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      if (hasOverlap(sections[i], sections[j])) {
        conflicts.push({ s1: sections[i], s2: sections[j] });
      }
    }
  }
  return conflicts;
};
