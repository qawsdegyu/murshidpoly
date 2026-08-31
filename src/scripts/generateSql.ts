import fs from 'fs';
import { courses } from '../data/mockData.js';
import { majorCurriculum } from '../data/majorsData.js';

function generateSQL() {
  console.log(`Generating SQL for ${courses.length} courses...`);
  
  // Build a map of courseId -> Set of majorIds
  const courseMajorsMap: Record<string, Set<string>> = {};

  for (const course of courses) {
    courseMajorsMap[course.id] = new Set();
    if (course.majors && Array.isArray(course.majors)) {
      course.majors.forEach(m => courseMajorsMap[course.id].add(m));
    }
  }

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

  const sqlStatements = courses.map(c => {
    const majorsSet = courseMajorsMap[c.id] || new Set();
    let finalMajors = Array.from(majorsSet);
    
    if (finalMajors.length === 0) {
      const depMap: Record<string, string> = {
        "Network Security": "network-security",
        "Civil Engineering": "civil",
        "Mechanical Engineering": "mechanical",
        "Autotronics Engineering": "autotronics",
        "Mechatronics": "mechatronics",
        "Mechatronics Engineering": "mechatronics",
        "Computer Engineering": "computer",
        "Telecommunications Engineering": "telecom",
        "Chemical Engineering": "chemical",
        "Electrical Engineering": "electrical",
        "Thermal & Hydraulic Machines": "thermal",
        "Thermal Engineering": "thermal",
        "Architecture": "architecture",
        "Architecture Engineering": "architecture",
        "Industrial Engineering": "industrial"
      };
      
      const dept = c.department || '';
      if (depMap[dept]) {
        finalMajors = [depMap[dept]];
      } else {
        finalMajors = ["common"];
      }
    }

    // Force ONLY true university requirements to be common
    const univReqs = ['national_studies', 'islamic_culture', 'applied_arabic', 'english101', 'english102', 'military_science', 'entrepreneurship', 'ar99', 'eng99', 'cs99'];
    if (univReqs.includes(c.id)) {
        if (!finalMajors.includes("common")) {
            finalMajors.push("common");
        }
    }

    // Escape quotes for SQL
    const nameEn = (c.name || '').replace(/'/g, "''");
    const nameAr = (c.nameAr || '').replace(/'/g, "''");
    const department = (c.department || 'General').replace(/'/g, "''");
    
    const majorsArrayString = "{" + finalMajors.map(m => `"${m}"`).join(',') + "}";

    return `INSERT INTO public.courses (id, code, name_en, name_ar, credit_hours, department, category, majors) VALUES ('${c.id}', '${c.code}', '${nameEn}', '${nameAr}', ${c.hours || 3}, '${department}', '${c.category || 'other'}', '${majorsArrayString}') ON CONFLICT (id) DO UPDATE SET majors = EXCLUDED.majors;`;
  });

  const finalSql = `-- AUTO-GENERATED COURSES SEED FILE --\n\n` + sqlStatements.join('\n');
  fs.writeFileSync('courses_seed.sql', finalSql);
  console.log('Successfully wrote courses_seed.sql with ' + sqlStatements.length + ' queries.');
}

generateSQL();
