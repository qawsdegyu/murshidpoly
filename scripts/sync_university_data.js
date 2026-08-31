import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Using the appsrv2 URL provided in your curl requests
const UNIVERSITY_API_URL = "http://appsrv2.fet.edu.jo:7777/courses/actions/rmiMethod";

const cleanString = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/(?:<br\s*\/?>\s*)+/gi, ' / ') // Collapse multiple consecutive HTML breaks into a single slash
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(?:\s*\/\s*)+/g, ' / ')      // Collapse multiple slashes (e.g. '/ /') into a single slash
    .trim();
};

async function sendUniversityRequest(method, params = []) {
  const paramsStr = params.map((p, i) => `&param${i}=${p}`).join('');
  const body = `method=${method}&paramsCount=${params.length}${paramsStr}`;

  try {
    const response = await fetch(UNIVERSITY_API_URL, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch (e) {
      // The university API sometimes returns invalid JSON (e.g., single quotes or Python dict format).
      // We use a safe JS eval equivalent to parse javascript-like object literals.
      try {
        const relaxedParser = new Function('return ' + text);
        return relaxedParser();
      } catch (innerError) {
        console.warn(`[WARNING] Failed to parse response for ${method}. Raw text snippet: ${text.substring(0, 100)}...`);
        return null;
      }
    }
  } catch (e) {
    console.error(`[ERROR] Request failed for method ${method}: ${e.message}`);
    return null;
  }
}

async function syncUniversityData() {
  console.log(`[${new Date().toISOString()}] Starting University Sync (Local JSON version with Page Autofetch & Deduplication)...`);

  // Define target degree and college based on user request (Bachelor = 3, FET = 2)
  const targetDegreeId = "3"; // بكالوريوس
  const targetCollegeId = "2"; // كلية الهندسة التكنولوجية

  const finalData = {
    last_updated: new Date().toISOString(),
    departments: [],
    courses: []
  };

  const uniqueCoursesMap = new Map();

  // 3. Sync Departments for College 2
  console.log(`Fetching departments for college ${targetCollegeId}...`);
  const departments = await sendUniversityRequest("getDepartments", [targetCollegeId]);
  
  if (departments && departments.length > 0) {
    finalData.departments = departments.map(d => ({
      id: cleanString(d.id),
      name: cleanString(d.name),
      college_id: targetCollegeId
    }));
    
    console.log(`Found ${departments.length} departments.`);

    // 4. Sync Courses (Sections) for each Department
    for (const dept of departments) {
      console.log(`\nSyncing courses for Dept: ${dept.name} (ID: ${dept.id})...`);
      
      let page = 1;
      let totalInserted = 0;

      while (true) {
        const courses = await sendUniversityRequest("getCourses", [targetDegreeId, targetCollegeId, dept.id, page]);
        
        if (!courses || !Array.isArray(courses) || courses.length === 0) {
          // No more pages or empty response, stop pagination for this department
          break;
        }
        
        const formattedCourses = courses.map(c => ({
          course_no: cleanString(c.no),
          name: cleanString(c.name),
          hours: cleanString(c.hours),
          status: cleanString(c.status),
          rooms: cleanString(c.rooms),
          times: cleanString(c.times),
          lecturers: cleanString(c.lecturers),
          remarks: cleanString(c.remarks),
          section_no: cleanString(c.sectionNo),
          degree_id: targetDegreeId,
          college_id: targetCollegeId,
          department_id: cleanString(dept.id)
        }));
        
        for (const c of formattedCourses) {
          const key = `${c.course_no}_${c.section_no}`;
          if (!uniqueCoursesMap.has(key)) {
            uniqueCoursesMap.set(key, c);
            totalInserted++;
          }
        }
        
        page++;
        // Small delay to respect server limits
        await new Promise(res => setTimeout(res, 50));
      }
      console.log(`Successfully extracted ${totalInserted} unique sections for ${dept.name}.`);
    }
  }

  // Convert map values to array
  finalData.courses = Array.from(uniqueCoursesMap.values());

  // Save to local JSON file
  const outputPath = path.join(__dirname, '../src/data/university_data.json');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');
  
  console.log(`\n[${new Date().toISOString()}] University Sync Completed! Saved ${finalData.courses.length} unique sections locally to src/data/university_data.json`);
}

syncUniversityData().catch(err => {
  console.error("Fatal Error:", err);
});
