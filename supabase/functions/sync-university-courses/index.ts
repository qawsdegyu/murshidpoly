// @ts-nocheck
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import JSON5 from "https://esm.sh/json5@2.2.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const SOURCE = "http://appserver.fet.edu.jo:7778/courses/actions/rmiMethod";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const clean = (value: unknown) => String(value ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
const statusOf = (value: unknown) => {
  const v = clean(value).toLowerCase();
  if (["2", "ملغاة", "ملغى", "cancelled", "canceled"].includes(v)) return "2";
  if (["3", "مغلقة", "مغلق", "closed"].includes(v)) return "3";
  return "1";
};

async function sourceRequest(method: string, params: string[] = []) {
  const body = new URLSearchParams({ method, paramsCount: String(params.length) });
  params.forEach((value, index) => body.set(`param${index}`, value));
  const response = await fetch(SOURCE, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" }, body });
  if (!response.ok) throw new Error(`${method} returned ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  let text = new TextDecoder("utf-8").decode(bytes);
  if (text.includes("�")) text = new TextDecoder("windows-1256").decode(bytes);
  try { return JSON.parse(text); } catch {
    try { return JSON5.parse(text); } catch { throw new Error(`${method} returned invalid data`); }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: "Authentication required" }, 401);
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!profile?.is_admin) return json({ error: "Admin permission required" }, 403);

  try {
    const [degrees, colleges] = await Promise.all([sourceRequest("getDegrees"), sourceRequest("getColleges")]);
    if (!Array.isArray(degrees) || !Array.isArray(colleges) || !degrees.length || !colleges.length) throw new Error("Official source returned no degrees or colleges");
    await supabase.from("degrees").upsert(degrees.map((x: any) => ({ id: String(x.id), name: clean(x.name) })));
    await supabase.from("colleges").upsert(colleges.map((x: any) => ({ id: String(x.id), name: clean(x.name) })));
    let rowsSeen = 0;
    let cancelledSeen = 0;
    for (const college of colleges) {
      const collegeId = String(college.id);
      const departments = await sourceRequest("getDepartments", [collegeId]);
      if (!Array.isArray(departments)) throw new Error(`Invalid departments for ${collegeId}`);
      await supabase.from("departments").upsert(departments.map((d: any) => ({ id: String(d.id), name: clean(d.name), college_id: collegeId })));
      for (const degree of degrees) {
        const degreeId = String(degree.id);
        for (const department of departments) {
          const departmentId = String(department.id);
          const pageInfo = await sourceRequest("getCoursesPagesCount", [degreeId, collegeId, departmentId]);
          const pageCount = Math.max(1, Number(Array.isArray(pageInfo) ? pageInfo[0] : pageInfo) || 1);
          const rows: any[] = [];
          for (let page = 1; page <= pageCount; page++) {
            const courses = await sourceRequest("getCourses", [degreeId, collegeId, departmentId, String(page)]);
            if (!Array.isArray(courses)) throw new Error(`Invalid courses page ${page}`);
            for (const c of courses) {
              const courseNo = clean(c.no);
              if (!courseNo) continue;
              const status = statusOf(c.status);
              rows.push({ course_no: courseNo, name: clean(c.name), hours: clean(c.hours), status, rooms: clean(c.rooms), times: clean(c.times), lecturers: clean(c.lecturers), remarks: clean(c.remarks), section_no: clean(c.sectionNo) || "1", degree_id: degreeId, college_id: collegeId, department_id: departmentId, last_updated: new Date().toISOString() });
              rowsSeen++;
              if (status === "2") cancelledSeen++;
            }
          }
          const uniqueRows = Array.from(new Map(rows.map((row) => [
            `${row.course_no}|${row.section_no}|${row.degree_id}|${row.college_id}|${row.department_id}`,
            row,
          ])).values());
          if (uniqueRows.length) {
            const { error } = await supabase.from("university_courses").upsert(uniqueRows, { onConflict: "course_no,section_no,degree_id,college_id,department_id" });
            if (error) throw error;
          }
        }
      }
    }
    return json({ ok: true, rows_seen: rowsSeen, cancelled_seen: cancelledSeen, synced_at: new Date().toISOString() });
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 502);
  }
});
