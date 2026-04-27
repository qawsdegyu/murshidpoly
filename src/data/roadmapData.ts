import { courses, resourcesByCourse } from "./mockData";

export interface RoadmapNode {
  id: string;
  prerequisites: string[];
  corequisites: string[]; // Added corequisites
  level: number;
  position: { x: number; y: number };
  category: "common" | "computer" | "civil" | "mechatronics" | "mechanical" | "chemical";
  fallbackName?: string;
  fallbackNameAr?: string;
}

export const roadmapNodes: RoadmapNode[] = [
  // --- Mathematics Track ---
  { id: "c6", prerequisites: [], corequisites: [], level: 0, position: { x: 15, y: 10 }, category: "common" },
  { id: "c2", prerequisites: ["c6"], corequisites: [], level: 1, position: { x: 30, y: 10 }, category: "common" },
  { id: "numerical", prerequisites: ["c2"], corequisites: [], level: 2, position: { x: 45, y: 5 }, category: "common" },
  { id: "diff_eq", prerequisites: ["c2"], corequisites: [], level: 2, position: { x: 45, y: 15 }, category: "common" },
  { id: "stat101", prerequisites: ["c2"], corequisites: [], level: 2, position: { x: 45, y: 25 }, category: "common" },
  { id: "linear_algebra", prerequisites: [], corequisites: [], level: 0, position: { x: 15, y: 20 }, category: "common" },

  // --- Physics Track ---
  { id: "p101", prerequisites: [], corequisites: [], level: 0, position: { x: 15, y: 35 }, category: "common" },
  { id: "p102", prerequisites: ["p101"], corequisites: [], level: 1, position: { x: 30, y: 35 }, category: "common" },
  { id: "plab101", prerequisites: [], corequisites: ["p101"], level: 0, position: { x: 15, y: 45 }, category: "common" },
  { id: "plab102", prerequisites: [], corequisites: ["p102"], level: 1, position: { x: 30, y: 45 }, category: "common" },
  { id: "c4", prerequisites: ["p101"], corequisites: [], level: 1, position: { x: 30, y: 25 }, category: "common" },

  // --- Chemistry Track ---
  { id: "chem101", prerequisites: [], corequisites: [], level: 0, position: { x: 15, y: 60 }, category: "common" },
  { id: "chemlab101", prerequisites: [], corequisites: ["chem101"], level: 0, position: { x: 15, y: 70 }, category: "common" },

  // --- Computer & Engineering Track ---
  { id: "cs99", prerequisites: [], corequisites: [], level: 0, position: { x: 5, y: 85 }, category: "common" },
  { id: "cs101", prerequisites: ["cs99"], corequisites: [], level: 1, position: { x: 20, y: 85 }, category: "common" },
  { id: "programming_cpp", prerequisites: ["cs101"], corequisites: [], level: 2, position: { x: 35, y: 80 }, category: "common" },
  { id: "engineering_workshop", prerequisites: [], corequisites: [], level: 0, position: { x: 20, y: 95 }, category: "common" },
  { id: "engineering_drawing", prerequisites: ["cs101", "engineering_workshop"], corequisites: [], level: 2, position: { x: 35, y: 90 }, category: "common" },

  // --- Languages Track ---
  { id: "arabic99", prerequisites: [], corequisites: [], level: 0, position: { x: 55, y: 10 }, category: "common" },
  { id: "applied_arabic", prerequisites: ["arabic99"], corequisites: [], level: 1, position: { x: 70, y: 10 }, category: "common" },
  { id: "eng99", prerequisites: [], corequisites: [], level: 0, position: { x: 55, y: 25 }, category: "common" },
  { id: "english101", prerequisites: ["eng99"], corequisites: [], level: 1, position: { x: 70, y: 25 }, category: "common" },
  { id: "english102", prerequisites: ["english101"], corequisites: [], level: 2, position: { x: 85, y: 25 }, category: "common" },

  // --- Standalone Subjects ---
  { id: "ee201", prerequisites: [], corequisites: [], level: 3, position: { x: 60, y: 45 }, category: "common" },
  { id: "national_studies", prerequisites: [], corequisites: [], level: 3, position: { x: 60, y: 55 }, category: "common" },
  { id: "military_science", prerequisites: [], corequisites: [], level: 3, position: { x: 60, y: 65 }, category: "common" },
  { id: "entrepreneurship", prerequisites: [], corequisites: [], level: 3, position: { x: 75, y: 45 }, category: "common" },
  { id: "islamic_culture", prerequisites: [], corequisites: [], level: 3, position: { x: 75, y: 55 }, category: "common" },
  { id: "technical_writing", prerequisites: [], corequisites: [], level: 3, position: { x: 75, y: 65 }, category: "common" },

  // --- Civil Engineering Track (المدنية) ---
  // Structural & Geotechnical
  { id: "ce_dynamics", prerequisites: ["c4"], corequisites: [], level: 2, position: { x: 45, y: 15 }, category: "civil" },
  { id: "ce_strength", prerequisites: ["c4"], corequisites: [], level: 2, position: { x: 45, y: 25 }, category: "civil" },
  { id: "ce_structural1", prerequisites: ["ce_strength"], corequisites: [], level: 3, position: { x: 60, y: 25 }, category: "civil" },
  { id: "ce_structural2", prerequisites: ["ce_structural1"], corequisites: [], level: 4, position: { x: 75, y: 15 }, category: "civil", fallbackName: "Structural Analysis 2", fallbackNameAr: "تحليل إنشائي 2" },
  { id: "ce_rc1", prerequisites: ["ce_structural1"], corequisites: [], level: 4, position: { x: 75, y: 25 }, category: "civil", fallbackName: "RC Design 1", fallbackNameAr: "تصميم الخرسانة المسلحة 1" },
  { id: "ce_steel", prerequisites: ["ce_structural1"], corequisites: [], level: 4, position: { x: 75, y: 35 }, category: "civil", fallbackName: "Steel Structures", fallbackNameAr: "منشآت فولاذية" },
  { id: "ce_rc2", prerequisites: ["ce_rc1"], corequisites: [], level: 5, position: { x: 90, y: 20 }, category: "civil", fallbackName: "RC Design 2", fallbackNameAr: "تصميم الخرسانة المسلحة 2" },
  { id: "ce_concrete", prerequisites: ["ce_rc1"], corequisites: [], level: 5, position: { x: 90, y: 30 }, category: "civil", fallbackName: "Concrete Properties", fallbackNameAr: "خواص الخرسانة" },
  
  { id: "ce_geotech", prerequisites: [], corequisites: [], level: 2, position: { x: 45, y: 40 }, category: "civil", fallbackName: "Geotechnical Engineering", fallbackNameAr: "هندسة جيوتقنية" },
  { id: "ce_foundation", prerequisites: ["ce_geotech"], corequisites: [], level: 3, position: { x: 60, y: 40 }, category: "civil", fallbackName: "Foundation Engineering", fallbackNameAr: "هندسة الأساسات" },

  // Roads & Surveying
  { id: "ce_surveying", prerequisites: [], corequisites: [], level: 2, position: { x: 30, y: 55 }, category: "civil" },
  { id: "ce_roads", prerequisites: ["ce_surveying"], corequisites: [], level: 3, position: { x: 45, y: 55 }, category: "civil", fallbackName: "Highway Engineering", fallbackNameAr: "هندسة الطرق" },
  { id: "ce_traffic", prerequisites: ["ce_roads"], corequisites: [], level: 4, position: { x: 60, y: 50 }, category: "civil" },
  { id: "ce_pavement", prerequisites: ["ce_roads"], corequisites: [], level: 4, position: { x: 60, y: 60 }, category: "civil", fallbackName: "Pavement Design", fallbackNameAr: "تصميم رصفات" },
  { id: "ce_pavement_rehab", prerequisites: ["ce_pavement"], corequisites: [], level: 5, position: { x: 75, y: 55 }, category: "civil", fallbackName: "Pavement Rehabilitation", fallbackNameAr: "تأهيل الطرق والرصفات" },
  { id: "ce_pavement_lab", prerequisites: ["ce_pavement"], corequisites: [], level: 5, position: { x: 75, y: 65 }, category: "civil", fallbackName: "Pavement Lab", fallbackNameAr: "مختبر رصفات" },

  // Water & Environment
  { id: "ce_fluids", prerequisites: [], corequisites: [], level: 2, position: { x: 45, y: 75 }, category: "civil" },
  { id: "ce_hydraulics", prerequisites: ["ce_fluids"], corequisites: [], level: 3, position: { x: 60, y: 75 }, category: "civil", fallbackName: "Hydraulics", fallbackNameAr: "هندسة المائيات" },
  { id: "ce_water_treatment", prerequisites: ["chem101"], corequisites: [], level: 3, position: { x: 45, y: 85 }, category: "civil", fallbackName: "Water Treatment", fallbackNameAr: "معالجة المياه" },
  { id: "ce_wastewater", prerequisites: ["ce_water_treatment"], corequisites: [], level: 4, position: { x: 60, y: 85 }, category: "civil", fallbackName: "Wastewater Engineering", fallbackNameAr: "هندسة مياه عادمة" },

  // Projects
  { id: "ce_project1", prerequisites: [], corequisites: [], level: 5, position: { x: 75, y: 85 }, category: "civil", fallbackName: "Graduation Project 1", fallbackNameAr: "مشروع 1" },
  { id: "ce_project2", prerequisites: ["ce_project1"], corequisites: [], level: 6, position: { x: 90, y: 85 }, category: "civil", fallbackName: "Graduation Project 2", fallbackNameAr: "مشروع 2" },
];

export const activeRoadmap = roadmapNodes;


