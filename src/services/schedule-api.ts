import { supabase } from '../lib/supabase';
import { Section } from '../data/sections';
import { Course } from '../data/mockData';
import { mapUniversityCourseToCourse, mapUniversityCourseToSection } from '../lib/university-mapper';

export const scheduleApi = {
  /**
   * Fetches unique courses from the university_courses table
   */
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('university_courses')
      .select('*')
      .limit(10000);

    if (error) {
      console.error("Error fetching courses from university_courses:", error);
      throw error;
    }

    // Deduplicate by course_no
    const courseMap = new Map();
    data.forEach(item => {
      const mapped = mapUniversityCourseToCourse(item);
      if (!courseMap.has(mapped.id)) {
        courseMap.set(mapped.id, mapped);
      }
    });

    return Array.from(courseMap.values());
  },

  /**
   * Fetches all sections from the university_courses table
   */
  async getSections(semester: string = '2024-2025-summer'): Promise<Section[]> {
    const { data, error } = await supabase
      .from('university_courses')
      .select('*')
      .limit(10000);

    if (error) {
      console.error("Error fetching sections from university_courses:", error);
      throw error;
    }

    return data.flatMap(mapUniversityCourseToSection);
  }
};
