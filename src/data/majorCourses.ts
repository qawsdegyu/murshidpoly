/**
 * majorCourses.ts
 * Two-tier curriculum mapping: Major → Year → Semester → CourseIds
 */

export interface SemesterCourses {
  semester: 1 | 2;
  labelAr: string;
  labelEn: string;
  courseIds: string[];
}

export interface YearCurriculum {
  year: number;
  labelAr: string;
  labelEn: string;
  semesters: SemesterCourses[];
}

// Standard Year 1 mapping for all engineering majors
const STANDARD_YEAR_1: SemesterCourses[] = [
  {
    semester: 1,
    labelAr: "الفصل الأول",
    labelEn: "Semester 1",
    courseIds: ["c6", "p101", "plab101", "english101", "applied_arabic", "national_studies"],
  },
  {
    semester: 2,
    labelAr: "الفصل الثاني",
    labelEn: "Semester 2",
    courseIds: ["c2", "p102", "programming_cpp", "engineering_drawing", "english102"],
  },
];

/** Map: majorId → YearCurriculum[] */
export const majorCurriculum: Record<string, YearCurriculum[]> = {
  "common": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["plab102", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["islamic_culture", "diff_eq"] },
      ],
    },
  ],
  "network-security": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["islamic_culture"] },
      ],
    },
  ],
  "mechanical": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c4", "c5", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ee201"] },
      ],
    },
  ],
  "civil": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c4", "ce_surveying", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ce_dynamics", "ce_strength"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["numerical", "ce_structural1"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ce_roads", "ce_traffic"] },
      ],
    },
  ],
  "mechatronics": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c4", "c5", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ee201"] },
      ],
    },
  ],
  "chemical": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["c4", "c7", "stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ee201"] },
      ],
    },
  ],
  "computer": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
    {
      year: 2, labelAr: "السنة الثانية", labelEn: "Year 2",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["stat101"] },
        { semester: 2, labelAr: "الفصل الثاني", labelEn: "Semester 2", courseIds: ["ee201"] },
      ],
    },
    {
      year: 3, labelAr: "السنة الثالثة", labelEn: "Year 3",
      semesters: [
        { semester: 1, labelAr: "الفصل الأول", labelEn: "Semester 1", courseIds: ["numerical", "c3"] },
      ],
    },
  ],
  "autotronics": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "thermal": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "telecom": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "electrical": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "industrial": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
  "architecture": [
    { year: 1, labelAr: "السنة الأولى", labelEn: "Year 1", semesters: STANDARD_YEAR_1 },
  ],
};
