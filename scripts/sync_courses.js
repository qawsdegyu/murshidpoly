import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const API_URL = "http://appsrv2.fet.edu.jo:7777/courses/actions/rmiMethod";

const cleanString = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/(?:<br\s*\/?>\s*)+/gi, ' / ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(?:\s*\/\s*)+/g, ' / ')
    .trim();
};

async function sendRequest(method, params = []) {
  const paramsStr = params.map((p, i) => `&param${i}=${p}`).join('');
  const body = `method=${method}&paramsCount=${params.length}${paramsStr}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0'
      },
      body: body
    });

    if (!response.ok) return null;
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch (e) {
      try {
        const relaxedParser = new Function('return ' + text);
        return relaxedParser();
      } catch (innerError) {
        return null;
      }
    }
  } catch (e) {
    console.error(`Error fetching ${method}: ${e.message}`);
    return null;
  }
}

async function fetchAllBachelorCourses() {
  console.log(`[${new Date().toISOString()}] Fetching university data...`);
  const degreeId = "3"; // Bachelor
  const collegeId = "2"; // FET
  
  const departments = await sendRequest("getDepartments", [collegeId]);
  if (!departments) {
    console.log("Failed to fetch departments.");
    return [];
  }
  
  const uniqueCoursesMap = new Map();
  
  for (const dept of departments) {
    const deptId = dept.id;
    let page = 1;
    let totalInserted = 0;
    
    while (true) {
      const courses = await sendRequest("getCourses", [degreeId, collegeId, deptId, page]);
      
      if (!courses || !Array.isArray(courses) || courses.length === 0) {
        break;
      }
      
      const formattedCourses = courses.map(c => {
        let mappedStatus = 'متاحة';
        const rawStatus = cleanString(c.status);
        if (rawStatus === '3') mappedStatus = 'مغلقة';
        else if (rawStatus === '1') mappedStatus = 'متاحة';
        else mappedStatus = rawStatus;

        const timesStr = cleanString(c.times);
        const parts = timesStr.split(' ');
        const timeParts = parts.filter(p => p.includes(':'));
        const time_start = timeParts[0] || '';
        const time_end = timeParts[1] || '';
        const days = parts.filter(p => !p.includes(':')).join(' ');

        return {
          course_code: cleanString(c.no),
          course_name: cleanString(c.name),
          section_number: parseInt(cleanString(c.sectionNo)) || 1,
          status: mappedStatus,
          room: cleanString(c.rooms),
          days: days,
          time_start: time_start,
          time_end: time_end,
          instructor: cleanString(c.lecturers),
          department: cleanString(dept.name),
          department_id: String(deptId)
        };
      });
      
      for (const c of formattedCourses) {
        const key = `${c.course_code}_${c.section_number}`;
        if (!uniqueCoursesMap.has(key)) {
          uniqueCoursesMap.set(key, c);
          totalInserted++;
        }
      }
      
      page++;
      await new Promise(res => setTimeout(res, 50));
    }
  }
  
  return Array.from(uniqueCoursesMap.values());
}

async function syncToPublic() {
  const data = await fetchAllBachelorCourses();
  if (data.length === 0) {
    console.log("No data fetched, aborting sync.");
    return;
  }

  console.log(`Fetched ${data.length} unique sections. Saving to public/university_data.json...`);

  const outputPath = join(__dirname, '..', 'public', 'university_data.json');
  fs.writeFileSync(outputPath, JSON.stringify({ courses: data }, null, 2));

  console.log(`Successfully synced ${data.length} sections to ${outputPath}`);
}

async function startBackgroundSync() {
  console.log("Starting background sync service (every 1 minute)...");
  await syncToPublic(); // initial run
  
  // Run every 60 seconds
  setInterval(async () => {
    try {
      await syncToPublic();
    } catch (e) {
      console.error("Error during scheduled sync:", e);
    }
  }, 60 * 1000);
}

startBackgroundSync().catch(console.error);
