import { describe, expect, it } from "vitest";
import { isCourseVisibleForMajor } from "./majors";

describe("isCourseVisibleForMajor", () => {
  it("uses explicit membership as the source of truth", () => {
    const course = {
      name_ar: "برمجة للمهندسين",
      department: "Network Security",
      category: "computing",
      majors: ["computer"],
    };

    expect(isCourseVisibleForMajor(course, "computer")).toBe(true);
    expect(isCourseVisibleForMajor(course, "network-security")).toBe(false);
  });

  it("keeps a genuinely shared foundation visible", () => {
    const course = { name_ar: "الرياضيات التطبيقية", category: "Math", majors: ["common"] };
    expect(isCourseVisibleForMajor(course, "computer")).toBe(true);
    expect(isCourseVisibleForMajor(course, "chemical")).toBe(true);
  });

  it("routes common-only department rows to an unambiguous major", () => {
    const course = {
      name_ar: "رسم ميكانيكي – Mechanical",
      department: "Network Engineering",
      category: "Core",
      majors: ["common"],
    };

    expect(isCourseVisibleForMajor(course, "mechanical")).toBe(true);
    expect(isCourseVisibleForMajor(course, "network-security")).toBe(false);
  });

  it("does not leak common-only imported core rows from a misleading department", () => {
    const course = {
      name_ar: "أنظمة المعالجات الدقيقة",
      department: "Network Engineering",
      category: "Core",
      majors: ["common"],
    };

    expect(isCourseVisibleForMajor(course, "network-security")).toBe(false);
    expect(isCourseVisibleForMajor(course, "computer")).toBe(false);
  });

  it("routes legacy empty-membership rows by clear department", () => {
    const course = {
      name_ar: "متطلبات تخصص اختياري",
      department: "Computer Engineering",
      category: "computing",
      majors: [],
    };

    expect(isCourseVisibleForMajor(course, "computer")).toBe(true);
    expect(isCourseVisibleForMajor(course, "civil")).toBe(false);
  });
});
