const fs = require('fs');

// Read mockData.ts
const mockDataContent = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Read majorsData.ts for curriculum parsing
const majorsDataContent = fs.readFileSync('src/data/majorsData.ts', 'utf8');
const curriculumMatch = majorsDataContent.match(/export const majorCurriculum: Record<string, YearCurriculum\[\]> = ({[\s\S]*?});/);
const curriculumRaw = curriculumMatch ? curriculumMatch[1] : '';

const majorNames = [
  "common", "network-security", "mechatronics", "autotronics", "civil", 
  "architecture", "telecom", "electrical", "mechanical", "chemical", 
  "industrial", "thermal", "computer"
];
const courseToMajors = {};

for (const major of majorNames) {
  const majorRegex = new RegExp(`"${major}":\\s*\\[([\\s\\S]*?)(?="[a-z\\-]+":\\s*\\[|$)`);
  const match = curriculumRaw.match(majorRegex);
  if (match) {
    const courseIdsMatches = match[1].matchAll(/courseIds:\s*\[(.*?)\]/g);
    for (const m of courseIdsMatches) {
      const ids = m[1].match(/"([^"]+)"/g);
      if (ids) {
        for (const idQuoted of ids) {
          const courseId = idQuoted.replace(/"/g, '');
          if (!courseToMajors[courseId]) courseToMajors[courseId] = new Set();
          courseToMajors[courseId].add(major);
        }
      }
    }
  }
}

const mockDataContent = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Extract courses
const coursesMatch = mockDataContent.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
const courses = eval(coursesMatch[1].replace(/import.*?;/g, ''));

// Extract resourcesByCourse
const resourcesMatch = mockDataContent.match(/export const resourcesByCourse: Record<string, Resource\[\]> = ({[\s\S]*?});/);
// Simplify the eval by removing SAMPLE_* constants if they exist
let resourcesRaw = resourcesMatch[1];
resourcesRaw = resourcesRaw.replace(/SAMPLE_PDF/g, "'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'")
                          .replace(/SAMPLE_VIDEO/g, "'https://www.youtube.com/watch?v=dQw4w9WgXcQ'")
                          .replace(/SAMPLE_DOC/g, "'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'");

const resourcesByCourse = eval('(' + resourcesRaw + ')');

let sql = `-- Migration Script for Educational Data\n\n`;

// 1. Create Tables
sql += `-- Create Courses Table\n`;
sql += `CREATE TABLE IF NOT EXISTS public.courses (\n`;
sql += `  id TEXT PRIMARY KEY,\n`;
sql += `  code TEXT NOT NULL,\n`;
sql += `  name TEXT NOT NULL,\n`;
sql += `  name_ar TEXT,\n`;
sql += `  hours INTEGER,\n`;
sql += `  department TEXT,\n`;
sql += `  category TEXT,\n`;
sql += `  majors TEXT[],\n`;
sql += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL\n`;
sql += `);\n\n`;

sql += `-- Create Course Resources Table\n`;
sql += `CREATE TABLE IF NOT EXISTS public.course_resources (\n`;
sql += `  id TEXT PRIMARY KEY,\n`;
sql += `  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,\n`;
sql += `  title TEXT NOT NULL,\n`;
sql += `  type TEXT NOT NULL, -- summary, book, exam, video\n`;
sql += `  uploader TEXT,\n`;
sql += `  size TEXT,\n`;
sql += `  url TEXT NOT NULL,\n`;
sql += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL\n`;
sql += `);\n\n`;

// 2. Insert Courses
sql += `-- Insert Courses\n`;
sql += `INSERT INTO public.courses (id, code, name, name_ar, hours, department, category, majors) VALUES\n`;
const courseInserts = courses.map(c => {
  const cMajors = courseToMajors[c.id] ? Array.from(courseToMajors[c.id]) : ['common'];
  const pgArrayLiteral = `'{${cMajors.map(m => `"${m}"`).join(',')}}'`;
  return `('${c.id}', '${c.code}', '${c.name.replace(/'/g, "''")}', '${c.nameAr.replace(/'/g, "''")}', ${c.hours}, '${c.department.replace(/'/g, "''")}', '${c.category || ''}', ${pgArrayLiteral})`;
});
sql += courseInserts.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET \n  code = EXCLUDED.code, name = EXCLUDED.name, name_ar = EXCLUDED.name_ar, hours = EXCLUDED.hours, department = EXCLUDED.department, category = EXCLUDED.category, majors = EXCLUDED.majors;\n\n`;

// 3. Insert Resources
sql += `-- Insert Course Resources\n`;
const resourceInserts = [];
for (const courseId in resourcesByCourse) {
  const resources = resourcesByCourse[courseId];
  resources.forEach(r => {
    resourceInserts.push(`('${r.id}', '${courseId}', '${r.title.replace(/'/g, "''")}', '${r.type}', '${(r.uploader || 'Admin').replace(/'/g, "''")}', '${r.size || 'N/A'}', '${r.url}')`);
  });
}

if (resourceInserts.length > 0) {
  sql += `INSERT INTO public.course_resources (id, course_id, title, type, uploader, size, url) VALUES\n`;
  sql += resourceInserts.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET \n  course_id = EXCLUDED.course_id, title = EXCLUDED.title, type = EXCLUDED.type, uploader = EXCLUDED.uploader, size = EXCLUDED.size, url = EXCLUDED.url;\n`;
}

// 4. RLS Policies
sql += `\n-- Enable RLS\n`;
sql += `ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;\n`;
sql += `ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;\n\n`;

sql += `-- RLS Policies (Viewable by everyone)\n`;
sql += `CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (TRUE);\n`;
sql += `CREATE POLICY "Resources are viewable by everyone" ON public.course_resources FOR SELECT USING (TRUE);\n`;

fs.writeFileSync('educational_data_migration.sql', sql);
console.log('SQL Migration script generated: educational_data_migration.sql');
