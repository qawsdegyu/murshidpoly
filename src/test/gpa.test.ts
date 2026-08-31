import { describe, it, expect } from "vitest";
import { calcGpa, CourseEntry } from "../lib/gpa";

describe("calcGpa", () => {
  it("should calculate simple semester GPA and CGPA without repeats", () => {
    const courses: CourseEntry[] = [
      { id: "1", name: "Course A", hours: 3, grade: "A" }, // 4.0 * 3 = 12 points
      { id: "2", name: "Course B", hours: 3, grade: "B" }, // 3.0 * 3 = 9 points
    ];
    
    // Previous: 60 hours, 3.20 GPA -> 192 points
    const result = calcGpa(3.20, 60, courses);
    
    // Semester GPA: 21 points / 6 hours = 3.50
    expect(result.semesterGpa).toBeCloseTo(3.50, 2);
    expect(result.semesterHours).toBe(6);
    expect(result.semesterPoints).toBe(21);
    
    // New CGPA: (192 + 21) / 66 = 213 / 66 = 3.227
    expect(result.newCgpa).toBeCloseTo(3.227, 3);
    expect(result.totalHours).toBe(66);
  });

  it("should correctly handle repeated courses according to BAU rules", () => {
    const courses: CourseEntry[] = [
      { id: "1", name: "Repeated Course A", hours: 3, grade: "A", isRepeat: true, oldGrade: "F" }, // New: 4.0 * 3 = 12 points. Old: 0.0 * 3 = 0 points
      { id: "2", name: "Course B", hours: 3, grade: "B" }, // 3.0 * 3 = 9 points
    ];
    
    // Previous: 60 hours, 3.20 GPA -> 192 points.
    // One course of 3 hours is repeated. It was 'F' (0.0 points).
    // Adjusted Previous: 60 - 3 = 57 hours, 192 - (0.0 * 3) = 192 points.
    // Semester: 6 hours, 21 points.
    // New CGPA: (192 + 21) / (57 + 6) = 213 / 63 = 3.38
    const result = calcGpa(3.20, 60, courses);
    
    expect(result.semesterGpa).toBeCloseTo(3.50, 2);
    expect(result.semesterHours).toBe(6);
    expect(result.semesterPoints).toBe(21);
    
    expect(result.totalHours).toBe(63);
    expect(result.newCgpa).toBeCloseTo(3.381, 3);
  });

  it("should handle repeated courses with non-F old grades", () => {
    const courses: CourseEntry[] = [
      { id: "1", name: "Repeated Course A", hours: 3, grade: "A", isRepeat: true, oldGrade: "C" }, // New: 4.0 * 3 = 12 points. Old: 2.0 * 3 = 6 points
    ];
    
    // Previous: 60 hours, 3.20 GPA -> 192 points.
    // Adjusted Previous: 60 - 3 = 57 hours, 192 - 6 = 186 points.
    // Semester: 3 hours, 12 points.
    // New CGPA: (186 + 12) / (57 + 3) = 198 / 60 = 3.30
    const result = calcGpa(3.20, 60, courses);
    
    expect(result.semesterGpa).toBeCloseTo(4.00, 2);
    expect(result.semesterHours).toBe(3);
    expect(result.semesterPoints).toBe(12);
    
    expect(result.totalHours).toBe(60);
    expect(result.newCgpa).toBeCloseTo(3.30, 2);
  });
});
