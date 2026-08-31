const fs = require('fs');

// Read majorsData.ts
const majorsDataContent = fs.readFileSync('src/data/majorsData.ts', 'utf8');

// We need to parse majorCurriculum from majorsData.ts
const curriculumMatch = majorsDataContent.match(/export const majorCurriculum: Record<string, YearCurriculum\[\]> = ({[\s\S]*?});/);

let curriculumRaw = curriculumMatch[1];

// We need to carefully parse this object. Since it contains some JS objects, we can evaluate it if we stub out the types or do some regex mapping.
// Let's use a simpler approach: extract all courseIds for each major using regex.

const majors = [
  "common", "network-security", "mechatronics", "autotronics", "civil", 
  "architecture", "telecom", "electrical", "mechanical", "chemical", 
  "industrial", "thermal", "computer"
];

const courseToMajors = {};

// Parse courses per major using regex on curriculumRaw
for (const major of majors) {
  // Find the block for the major
  const majorRegex = new RegExp(`"${major}":\\s*\\[([\\s\\S]*?)(?="[a-z\\-]+":\\s*\\[|$)`);
  const match = curriculumRaw.match(majorRegex);
  if (match) {
    const block = match[1];
    // Find all courseIds arrays: courseIds: ["c6", "p101"]
    const courseIdsMatches = block.matchAll(/courseIds:\s*\[(.*?)\]/g);
    for (const m of courseIdsMatches) {
      const idsStr = m[1];
      const ids = idsStr.match(/"([^"]+)"/g);
      if (ids) {
        for (const idQuoted of ids) {
          const courseId = idQuoted.replace(/"/g, '');
          if (!courseToMajors[courseId]) {
            courseToMajors[courseId] = new Set();
          }
          courseToMajors[courseId].add(major);
        }
      }
    }
  }
}

// Generate the SQL migration
let sql = `-- Migration: Add majors to courses\n\n`;
sql += `ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS majors TEXT[] DEFAULT ARRAY[]::TEXT[];\n\n`;

// Also add a constraint/index if needed, but not strictly necessary

sql += `-- Update existing courses with their respective majors\n`;

for (const courseId in courseToMajors) {
  const majorsArray = Array.from(courseToMajors[courseId]);
  // Format as postgres array literal: {"network-security", "computer"}
  const pgArrayLiteral = `{${majorsArray.map(m => `"${m}"`).join(',')}}`;
  
  sql += `UPDATE public.courses SET majors = '${pgArrayLiteral}' WHERE id = '${courseId}';\n`;
}

// Now, handle any course that wasn't found in majorCurriculum
// Set their major to 'common' just in case so they aren't completely orphaned
sql += `\nUPDATE public.courses SET majors = '{"common"}' WHERE majors IS NULL OR cardinality(majors) = 0;\n`;

fs.writeFileSync('sql/add_majors_to_courses.sql', sql);
console.log('SQL Migration generated: sql/add_majors_to_courses.sql');
