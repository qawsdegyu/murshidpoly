export interface Section {
  id: string;
  courseId: string;
  instructorId: string;
  instructorName?: string; // Optional field for database-fetched names
  days: number[]; // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  room?: string;
  status?: string; // Status of the section (e.g., '1' for open, '0' or 'مغلقة' for closed)
  sectionNo?: string; // The physical section number (e.g., "101", "1")
}


export const mockSections: Section[] = [
  // MATH 101
  { id: "s1", courseId: "c6", instructorId: "f69", days: [0, 2, 4], startTime: "08:30", endTime: "09:30", room: "A-101" },
  { id: "s2", courseId: "c6", instructorId: "f69", days: [0, 2, 4], startTime: "10:30", endTime: "11:30", room: "A-101" },
  { id: "s3", courseId: "c6", instructorId: "f138", days: [1, 3], startTime: "08:00", endTime: "09:30", room: "B-202" },
  
  // MATH 102
  { id: "s4", courseId: "c2", instructorId: "f69", days: [0, 2, 4], startTime: "09:30", endTime: "10:30", room: "A-102" },
  { id: "s5", courseId: "c2", instructorId: "f19", days: [1, 3], startTime: "10:00", endTime: "11:30", room: "C-101" },
  
  // PHYS 101
  { id: "s6", courseId: "p101", instructorId: "f58", days: [0, 2, 4], startTime: "11:30", endTime: "12:30", room: "P-1" },
  { id: "s7", courseId: "p101", instructorId: "f58", days: [1, 3], startTime: "12:00", endTime: "13:30", room: "P-2" },
  
  // CS 101
  { id: "s8", courseId: "cs101", instructorId: "f130", days: [0, 2, 4], startTime: "13:30", endTime: "14:30", room: "Lab-1" },
  { id: "s9", courseId: "cs101", instructorId: "f130", days: [1, 3], startTime: "14:00", endTime: "15:30", room: "Lab-2" },
  
  // National Studies
  { id: "s10", courseId: "national_studies", instructorId: "f39", days: [0, 2, 4], startTime: "14:30", endTime: "15:30", room: "H-1" },
  { id: "s11", courseId: "national_studies", instructorId: "f85", days: [1, 3], startTime: "08:30", endTime: "10:00", room: "H-2" },

  // Programming C++
  { id: "s12", courseId: "programming_cpp", instructorId: "f130", days: [0, 2, 4], startTime: "08:30", endTime: "09:30", room: "Lab-3" },
  { id: "s13", courseId: "programming_cpp", instructorId: "f149", days: [1, 3], startTime: "11:30", endTime: "13:00", room: "Lab-3" },

  // Logic Design
  { id: "s14", courseId: "logic_design", instructorId: "f130", days: [0, 2, 4], startTime: "10:30", endTime: "11:30", room: "A-101" },
  { id: "s15", courseId: "logic_design", instructorId: "f52", days: [1, 3], startTime: "08:30", endTime: "10:00", room: "A-102" },

  // Data Structures
  { id: "s16", courseId: "data_structures", instructorId: "f130", days: [0, 2, 4], startTime: "12:30", endTime: "13:30", room: "Lab-4" },
  { id: "s17", courseId: "data_structures", instructorId: "f40", days: [1, 3], startTime: "14:00", endTime: "15:30", room: "Lab-4" },

  // Microprocessors
  { id: "s18", courseId: "microprocessors", instructorId: "f130", days: [0, 2, 4], startTime: "09:30", endTime: "10:30", room: "Lab-5" },

  // Mechatronics & Mechanical
  { id: "s19", courseId: "mecha_sensors", instructorId: "f130", days: [1, 3], startTime: "10:00", endTime: "11:30", room: "A-201" },
  { id: "s20", courseId: "mecha_plc", instructorId: "f130", days: [0, 2, 4], startTime: "14:30", endTime: "15:30", room: "A-202" },
  { id: "s21", courseId: "c5", instructorId: "f4", days: [0, 2, 4], startTime: "11:30", endTime: "12:30", room: "M-101" },
  { id: "s22", courseId: "circuit2", instructorId: "f2", days: [1, 3], startTime: "12:00", endTime: "13:30", room: "E-101" },
];
