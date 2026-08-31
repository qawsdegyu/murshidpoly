import { Section } from "../data/sections";
import { Course } from "../data/mockData";

/**
 * Maps FET University course data to the application's Section format
 */
export const mapUniversityCourseToSection = (uc: any): Section[] => {
  // Map Arabic day characters to numbers (0=Sun, 1=Mon, ..., 4=Thu)
  const dayChars: Record<string, number> = { 
    'ح': 0, 
    'ن': 1, 
    'ث': 2, 
    'ر': 3, 
    'خ': 4 
  };
  
  // A university course section might have multiple meeting slots split by ' / '
  const timesList = (uc.times || "").split(' / ');
  const roomsList = (uc.rooms || "").split(' / ');
  const lecturersList = (uc.lecturers || "").split(' / ');

  const sections: Section[] = [];

  timesList.forEach((timeSlot: string, index: number) => {
    if (!timeSlot.trim()) return;

    const days: number[] = [];
    const parts = timeSlot.split(' ');
    
    // Extract days
    for (const part of parts) {
      if (dayChars[part] !== undefined) {
        days.push(dayChars[part]);
      }
    }
    
    // Extract times (assuming format like "08:30 10:00")
    const timeParts = parts.filter((p: string) => p.includes(':'));
    const startTime = timeParts[0] || "08:00";
    const endTime = timeParts[1] || "09:00";

    const lecturer = lecturersList[index] || lecturersList[0] || 'TBA';
    const room = roomsList[index] || roomsList[0] || 'Online';

    const parentId = uc.id ? uc.id.toString() : `${uc.course_no}_${uc.section_no}`;
    // Build a unique sub-section ID so they don't clash on keying/mapping
    const sectionId = timesList.length > 1 ? `${parentId}_${index}` : parentId;

    sections.push({
      id: sectionId,
      courseId: uc.course_no,
      instructorId: 'uni-sync',
      instructorName: lecturer === 'غير محدد' ? 'TBA' : lecturer,
      days,
      startTime,
      endTime,
      room: room === 'غير محدد' ? 'Online' : room,
      status: uc.status ? uc.status.toString() : undefined,
      sectionNo: uc.section_no ? uc.section_no.toString() : undefined
    });
  });

  // Fallback in case no times were found or format split produced nothing
  if (sections.length === 0) {
    const parentId = uc.id ? uc.id.toString() : `${uc.course_no}_${uc.section_no}`;
    sections.push({
      id: parentId,
      courseId: uc.course_no,
      instructorId: 'uni-sync',
      instructorName: uc.lecturers === 'غير محدد' ? 'TBA' : uc.lecturers,
      days: [],
      startTime: "08:00",
      endTime: "09:00",
      room: uc.rooms === 'غير محدد' ? 'Online' : uc.rooms,
      status: uc.status ? uc.status.toString() : undefined,
      sectionNo: uc.section_no ? uc.section_no.toString() : undefined
    });
  }

  return sections;
};

/**
 * Maps FET University course data to the application's Course format
 */
export const mapUniversityCourseToCourse = (uc: any): Course => {
  return {
    id: uc.course_no,
    code: uc.course_no,
    name: uc.name,
    nameAr: uc.name,
    hours: parseInt(uc.hours) || 3,
    department: uc.department_id || "General",
    category: "common" // Default category
  };
};
