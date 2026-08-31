import catalogData from "./catalog.json";
import { Course } from "./mockData";
import { Section } from "./sections";

/**
 * Semester Catalog: The "Jerida" for the current semester.
 * Loaded from catalog.json for easy editing.
 */

export const currentSemesterCourses: Course[] = catalogData.courses as Course[];
export const currentSemesterSections: Section[] = catalogData.sections as Section[];
