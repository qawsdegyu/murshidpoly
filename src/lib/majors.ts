export type MajorOption = { id: string; name: string; nameEn: string };

// Single source of truth for every user-facing major selector.
// IDs intentionally stay aligned with the existing Supabase `courses.majors` values.
export const MAJOR_OPTIONS: MajorOption[] = [
  { id: "computer", name: "هندسة الحاسوب والبرمجيات", nameEn: "Computer Engineering & Software" },
  { id: "network-security", name: "هندسة أمن الشبكات والسيبراني", nameEn: "Network Security & Cybersecurity Engineering" },
  { id: "mechatronics", name: "هندسة الميكاترونكس", nameEn: "Mechatronics Engineering" },
  { id: "autotronics", name: "تكنولوجيا خدمة المركبات الكهربائية والهجينة", nameEn: "Electric & Hybrid Vehicle Service Technology" },
  { id: "civil", name: "هندسة الطرق والجسور", nameEn: "Roads & Bridges Engineering" },
  { id: "architecture", name: "الهندسة المعمارية", nameEn: "Architectural Engineering" },
  { id: "telecom", name: "هندسة الاتصالات", nameEn: "Telecommunications Engineering" },
  { id: "electrical", name: "تكنولوجيا الطاقة الكهربائية (تقني)", nameEn: "Electrical Power Technology" },
  { id: "mechanical", name: "هندسة الميكانيك العام", nameEn: "General Mechanical Engineering" },
  { id: "chemical", name: "هندسة الصناعات الكيميائية", nameEn: "Chemical Industries Engineering" },
  { id: "industrial", name: "تكنولوجيا تقييم المنشآت وصيانتها", nameEn: "Facilities Evaluation & Maintenance Technology" },
  { id: "thermal", name: "تكنولوجيا الأنظمة الهيدروليكية في الآلات الثقيلة", nameEn: "Hydraulic Systems Technology in Heavy Machinery" },
];

export const MAJOR_LABELS: Record<string, string> = Object.fromEntries(
  MAJOR_OPTIONS.map(({ id, name }) => [id, name]),
);

export const MAJOR_ALIASES: Record<string, string> = {
  comp: "computer",
  cs: "computer",
  cne: "computer",
  network: "network-security",
  networks: "network-security",
  "network engineering": "network-security",
  cybersecurity: "network-security",
  cyber: "network-security",
  chemicalengineering: "chemical",
  "chemical engineering": "chemical",
  mechanicalengineering: "mechanical",
  "mechanical engineering": "mechanical",
  mechatronicsengineering: "mechatronics",
  "computer engineering": "computer",
};

export const normalizeMajorId = (value: unknown): string => {
  const normalized = String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  return MAJOR_ALIASES[normalized] || normalized.replace(/[ _]+/g, "-");
};

export const normalizeCourseMajors = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(normalizeMajorId).filter(Boolean);
  if (typeof value === "string") return value.split(/[,|]/).map(normalizeMajorId).filter(Boolean);
  return ["common"];
};

export const normalizeAnnouncementMajors = (value: unknown): string[] => {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,|]/)
      : [];
  return Array.from(new Set(values.map(normalizeMajorId).filter(Boolean)));
};

export const isAnnouncementVisibleForMajor = (announcement: any, major: unknown, isAdmin = false): boolean => {
  if (isAdmin || announcement?.is_global) return true;
  const targets = normalizeAnnouncementMajors(announcement?.target_major);
  if (targets.includes("all") || targets.includes("*")) return true;
  const normalizedMajor = normalizeMajorId(major);
  return Boolean(normalizedMajor && targets.includes(normalizedMajor));
};

const departmentMajor = (department: unknown): string | null => {
  const value = String(department ?? "").toLowerCase();
  if (!value || /(general|mathemat|physics|science|human|business|islam|arabic|english|support|common|أساسي|عام|رياض|فيزياء|علوم|إنسان|إدارة|عربي|إنجليزي)/i.test(value)) return null;
  if (/(network|cyber|security|شبكات|سيبر|أمن)/i.test(value)) return "network-security";
  if (/(computer|computing|software|حاسوب|برمج|حوسب)/i.test(value)) return "computer";
  if (/(chemical|chemistry|process|كيمي|صناعات كيميائية)/i.test(value)) return "chemical";
  if (/(mechanical|ميكاني|ميكانيك)/i.test(value)) return "mechanical";
  if (/(mechatronic|ميكاترون)/i.test(value)) return "mechatronics";
  if (/(autotronic|automotive|أوتوترون|سيارات)/i.test(value)) return "autotronics";
  if (/(civil|مدني|طرق|جسور)/i.test(value)) return "civil";
  if (/(architecture|architect|معمار)/i.test(value)) return "architecture";
  if (/(telecom|communication|اتصالات)/i.test(value)) return "telecom";
  if (/(electrical|electric|كهرب)/i.test(value)) return "electrical";
  if (/(industrial|صناعي)/i.test(value)) return "industrial";
  if (/(thermal|حراري)/i.test(value)) return "thermal";
  return null;
};

const inferCourseMajor = (course: any): string | null => {
  const text = `${course?.name_ar ?? ""} ${course?.name_en ?? ""} ${course?.name ?? ""} ${course?.code ?? ""}`.toLowerCase();
  // Imported files sometimes carry a misleading department. A specific course title wins.
  if (/(mechanical|ميكاني|ميكانيك|ميكانيكي)/i.test(text)) return "mechanical";
  if (/(chemical|chemistry|كيمي|هندسة كيميائية)/i.test(text)) return "chemical";
  if (/(mechatronic|ميكاترون)/i.test(text)) return "mechatronics";
  if (/(autotronic|automotive|أوتوترون|سيارات)/i.test(text)) return "autotronics";
  if (/(civil|مدني|طرق|جسور)/i.test(text)) return "civil";
  if (/(architecture|architect|معمار)/i.test(text)) return "architecture";
  if (/(telecom|communication|اتصالات)/i.test(text)) return "telecom";
  if (/(electrical|electric|كهرب)/i.test(text)) return "electrical";
  if (/(industrial|صناعي)/i.test(text)) return "industrial";
  if (/(thermal|حراري)/i.test(text)) return "thermal";
  if (/(network|cyber|security|شبكات|سيبر|أمن)/i.test(text)) return "network-security";
  if (/(computer|computing|software|حاسوب|برمج|حوسب)/i.test(text)) return "computer";
  return null;
};

export const isCourseVisibleForMajor = (course: any, major: unknown): boolean => {
  const normalizedMajor = normalizeMajorId(major);
  if (!normalizedMajor) return true;

  // Explicit curriculum membership is the source of truth. A course that
  // belongs to one or more named majors must never leak into another major
  // just because its title contains a familiar keyword.
  const majors = normalizeCourseMajors(course?.majors);
  const explicitMajors = majors.filter((value) => !["common", "all", "*"].includes(value));
  if (explicitMajors.length > 0) return explicitMajors.includes(normalizedMajor);

  // A few legacy/imported rows have an empty or common-only membership. Use
  // the course title/department only when it unambiguously identifies one
  // major; this repairs old rows without turning every keyword into a leak.
  const inferredMajor = inferCourseMajor(course);
  if (inferredMajor) return inferredMajor === normalizedMajor;

  // Some legacy rows explicitly carry only `common` while their department
  // value was imported from a single batch and is therefore unreliable.
  // Only infer from department when the membership field is genuinely empty.
  const rawMajors = course?.majors;
  const hasMembership = Array.isArray(rawMajors)
    ? rawMajors.length > 0
    : typeof rawMajors === "string"
      ? rawMajors.trim().length > 0
      : false;
  if (!hasMembership) {
    const departmentalMajor = departmentMajor(course?.department);
    if (departmentalMajor) return departmentalMajor === normalizedMajor;
  }

  // Only genuinely shared foundation categories are visible to every major.
  // Keep department-specific Core/plan-import rows hidden until they carry
  // an explicit membership in the database.
  const category = String(course?.category ?? "").toLowerCase();
  return majors.includes("common") && ["general", "math", "physics", "chemistry", "support", "culture", "remedial", "lab"].includes(category);
};
