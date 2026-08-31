import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import JSON5 from 'json5';

const API_URL = 'http://appserver.fet.edu.jo:7778/courses/actions/rmiMethod';
const clean = (value: unknown) => String(value ?? '').replace(/(?:<br\s*\/?>\s*)+/gi, ' / ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();

async function universityRequest(method: string, params: string[] = []) {
  const body = new URLSearchParams({ method, paramsCount: String(params.length) });
  params.forEach((param, index) => body.set(`param${index}`, param));
  const response = await fetch(API_URL, { method: 'POST', headers: { Accept: '*/*', 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache', Pragma: 'no-cache', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, body, signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`University source returned ${response.status}`);
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch {
    try {
      const normalized = text.replace(/\bNone\b/g, 'null').replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bundefined\b/g, 'null');
      return JSON5.parse(normalized);
    } catch { throw new Error(`Invalid response from university source for ${method}`); }
  }
}

async function fetchSnapshot() {
  const degreeId = '3', collegeId = '2';
  const departments = await universityRequest('getDepartments', [collegeId]);
  if (!Array.isArray(departments)) throw new Error('No departments returned');
  const rows = new Map<string, Record<string, unknown>>();
  for (const department of departments) {
    let page = 1;
    while (page <= 100) {
      const courses = await universityRequest('getCourses', [degreeId, collegeId, String(department.id), String(page)]);
      if (!Array.isArray(courses) || courses.length === 0) break;
      for (const course of courses) {
        const row = {
          course_no: clean(course.no), name: clean(course.name), hours: clean(course.hours), status: clean(course.status),
          rooms: clean(course.rooms), times: clean(course.times), lecturers: clean(course.lecturers), remarks: clean(course.remarks),
          section_no: clean(course.sectionNo), degree_id: degreeId, college_id: collegeId, department_id: clean(department.id),
          last_updated: new Date().toISOString()
        };
        if (row.course_no && row.section_no) rows.set(`${row.course_no}::${row.section_no}`, row);
      }
      page += 1;
    }
  }
  return [...rows.values()];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const expectedSecret = process.env.NEWSPAPER_SYNC_SECRET;
  if (expectedSecret && req.headers.authorization !== `Bearer ${expectedSecret}`) return res.status(401).json({ error: 'Unauthorized' });
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return res.status(500).json({ error: 'Missing server-side Supabase configuration' });
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const snapshot = await fetchSnapshot();
    if (!snapshot.length) return res.status(502).json({ error: 'The university source returned no sections' });
    let synced = 0;
    for (let index = 0; index < snapshot.length; index += 100) {
      const { error } = await supabase.from('university_courses').upsert(snapshot.slice(index, index + 100), { onConflict: 'course_no,section_no,degree_id,college_id,department_id' });
      if (error) throw error;
      synced += Math.min(100, snapshot.length - index);
    }
    return res.status(200).json({ ok: true, synced, checkedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Newspaper sync failed', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Sync failed' });
  }
}
