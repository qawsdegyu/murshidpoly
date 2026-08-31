import { createClient } from '@supabase/supabase-js';
import { courses } from '../data/mockData.js';
import { majorCurriculum } from '../data/majorsData.js';

// Initialize Supabase client
// We need the URL and ANON KEY from the .env file
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCourses() {
  console.log(`Found ${courses.length} courses in mockData.ts`);
  
  // Build a map of courseId -> Set of majorIds
  const courseMajorsMap: Record<string, Set<string>> = {};

  // Initialize the map for all known courses
  for (const course of courses) {
    courseMajorsMap[course.id] = new Set();
    // If it already has majors defined in mockData, add them
    if (course.majors && Array.isArray(course.majors)) {
      course.majors.forEach(m => courseMajorsMap[course.id].add(m));
    }
  }

  // Go through all major curriculums and link courses to majors
  for (const [majorId, curriculum] of Object.entries(majorCurriculum)) {
    for (const year of curriculum) {
      for (const sem of year.semesters) {
        for (const courseId of sem.courseIds) {
          if (!courseMajorsMap[courseId]) {
            courseMajorsMap[courseId] = new Set();
          }
          courseMajorsMap[courseId].add(majorId);
        }
      }
    }
  }

  const coursesToInsert = courses.map(c => {
    const majorsSet = courseMajorsMap[c.id];
    let finalMajors = Array.from(majorsSet);
    
    // If it has no specific majors found in curriculum, it might be common or an elective
    if (finalMajors.length === 0) {
      finalMajors = ["common"]; // Default fallback
    }

    // Force some known common courses to have "common" if they are shared universally
    const commonPrefixes = ['math', 'phys', 'chem1', 'arab', 'eng', 'islamic', 'national', 'military', 'sport'];
    if (commonPrefixes.some(prefix => c.id.toLowerCase().startsWith(prefix))) {
        if (!finalMajors.includes("common")) {
            finalMajors.push("common");
        }
    }

    return {
      id: c.id,
      code: c.code,
      name_en: c.name || '',
      name_ar: c.nameAr || '',
      credit_hours: c.hours || 3,
      department: c.department || 'General',
      category: c.category || 'other',
      majors: finalMajors
    };
  });

  console.log('Preparing to upload to Supabase...');

  // We upload in chunks to avoid hitting payload limits
  const chunkSize = 50;
  for (let i = 0; i < coursesToInsert.length; i += chunkSize) {
    const chunk = coursesToInsert.slice(i, i + chunkSize);
    console.log(`Uploading chunk ${i / chunkSize + 1} of ${Math.ceil(coursesToInsert.length / chunkSize)}...`);
    
    const { data, error } = await supabase
      .from('courses')
      .upsert(chunk, { onConflict: 'id' });

    if (error) {
      console.error('Error uploading chunk:', error.message);
    } else {
      console.log(`Chunk uploaded successfully.`);
    }
  }

  console.log('Done uploading all courses!');
}

seedCourses().catch(console.error);
