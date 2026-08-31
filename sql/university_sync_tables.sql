-- SQL Migration: FET University Sync Tables

-- 1. Degrees Table
CREATE TABLE IF NOT EXISTS public.degrees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- 2. Colleges Table
CREATE TABLE IF NOT EXISTS public.colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    college_id TEXT REFERENCES public.colleges(id) ON DELETE CASCADE
);

-- 4. University Courses (Sections) Table
CREATE TABLE IF NOT EXISTS public.university_courses (
    id SERIAL PRIMARY KEY,
    course_no TEXT NOT NULL,
    name TEXT NOT NULL,
    hours TEXT,
    status TEXT,
    rooms TEXT,
    times TEXT,
    lecturers TEXT,
    remarks TEXT,
    section_no TEXT NOT NULL,
    degree_id TEXT REFERENCES public.degrees(id) ON DELETE CASCADE,
    college_id TEXT REFERENCES public.colleges(id) ON DELETE CASCADE,
    department_id TEXT REFERENCES public.departments(id) ON DELETE CASCADE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Unique constraint to allow upsert logic
    UNIQUE(course_no, section_no, degree_id, college_id, department_id)
);

-- 5. Enable RLS
ALTER TABLE public.degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_courses ENABLE ROW LEVEL SECURITY;

-- 6. Create Policies (Allowing anon inserts for the script)
-- NOTE: In production, it's better to use a service role key and restrict these.
CREATE POLICY "Allow anonymous select on degrees" ON public.degrees FOR SELECT TO public USING (true);
CREATE POLICY "Allow anonymous insert on degrees" ON public.degrees FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on degrees" ON public.degrees FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous select on colleges" ON public.colleges FOR SELECT TO public USING (true);
CREATE POLICY "Allow anonymous insert on colleges" ON public.colleges FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on colleges" ON public.colleges FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous select on departments" ON public.departments FOR SELECT TO public USING (true);
CREATE POLICY "Allow anonymous insert on departments" ON public.departments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on departments" ON public.departments FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous select on university_courses" ON public.university_courses FOR SELECT TO public USING (true);
CREATE POLICY "Allow anonymous insert on university_courses" ON public.university_courses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous update on university_courses" ON public.university_courses FOR UPDATE TO anon USING (true);
