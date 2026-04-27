// BAU 4.0 grading scale.
export const gradePoints: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.75,
  "B+": 3.5, "B": 3.0, "B-": 2.75,
  "C+": 2.5, "C": 2.0, "C-": 1.75,
  "D+": 1.5, "D": 1.0, "F": 0.0,
};

export const gradeOptions = Object.keys(gradePoints);

export interface CourseEntry {
  id: string;
  name: string;
  hours: number;
  grade: string;
}

export interface GpaResult {
  semesterGpa: number;
  semesterPoints: number;
  semesterHours: number;
  newCgpa: number;
  totalHours: number;
}

export function calcGpa(prevCgpa: number, prevHours: number, courses: CourseEntry[]): GpaResult {
  let semPoints = 0;
  let semHours = 0;
  for (const c of courses) {
    if (!c.grade || !c.hours || c.hours <= 0) continue;
    const gp = gradePoints[c.grade];
    if (gp === undefined) continue;
    semPoints += gp * c.hours;
    semHours += c.hours;
  }
  const semesterGpa = semHours > 0 ? semPoints / semHours : 0;
  const prevPoints = (prevCgpa || 0) * (prevHours || 0);
  const totalHours = (prevHours || 0) + semHours;
  const newCgpa = totalHours > 0 ? (prevPoints + semPoints) / totalHours : 0;
  return { semesterGpa, semesterPoints: semPoints, semesterHours: semHours, newCgpa, totalHours };
}
