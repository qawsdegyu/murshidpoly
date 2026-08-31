import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  const degreeId = "3"; // Bachelor
  const collegeId = "2"; // FET
  
  const departments = await sendRequest("getDepartments", [collegeId]);
  if (!departments) return [];
  
  const uniqueCoursesMap = new Map();
  
  for (const dept of departments) {
    const deptId = dept.id;
    let page = 1;
    
    while (true) {
      const courses = await sendRequest("getCourses", [degreeId, collegeId, deptId, page]);
      if (!courses || !Array.isArray(courses) || courses.length === 0) break;
      
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
        }
      }
      
      page++;
      await new Promise(res => setTimeout(res, 50));
    }
  }
  
  return Array.from(uniqueCoursesMap.values());
}

async function syncToSupabase() {
  const data = await fetchAllBachelorCourses();
  if (data.length === 0) {
    console.log(`[${new Date().toISOString()}] No data fetched.`);
    return;
  }

  // Insert/Upsert in batches
  let successCount = 0;
  for (let i = 0; i < data.length; i += 100) {
    const batch = data.slice(i, i + 100);
    // Note: Upsert requires a primary key or unique constraint on course_code and section_number
    const { error } = await supabase.from('available_sections').upsert(batch, { onConflict: 'course_code,section_number' });
    if (error) {
      console.error(`[${new Date().toISOString()}] Error upserting batch:`, error.message);
    } else {
      successCount += batch.length;
    }
  }

  console.log(`[${new Date().toISOString()}] Synced ${successCount}/${data.length} sections to Supabase.`);
}

async function startWorker() {
  console.log("Starting Supabase Sync Worker (Runs every 10 seconds)...");
  
  // Initial run
  await syncToSupabase();
  
  // Run every 10 seconds (10000 ms)
  setInterval(async () => {
    try {
      await syncToSupabase();
    } catch (e) {
      console.error("Worker error:", e);
    }
  }, 10000);
}

startWorker().catch(console.error);

// ---------------------------------------------------------
// خدعة الاستضافة المجانية (Free Hosting Trick)
// ---------------------------------------------------------
// خدمات مثل Render تطلب رسوماً للـ (Background Workers).
// لجعلها مجانية، سنقوم بتشغيل هذا السكربت كـ (Web Service) عادية.
// يجب أن نفتح بورت (Port) ونرد على أي طلب HTTP لكي تظن الاستضافة أن السيرفر يعمل.

import http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Sync Worker is running and healthy! \\n\\nThis server keeps the background task alive.');
});

server.listen(PORT, () => {
  console.log(`Fake web server listening on port ${PORT} to keep the host happy!`);
});
