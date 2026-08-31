-- Enable RLS on the sections table
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone (anonymous users) to insert sections
-- This is useful for initial data seeding via scripts using the anon key
CREATE POLICY "Allow anonymous inserts on sections" 
ON public.sections 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy to allow public viewing of sections
CREATE POLICY "Allow public select on sections" 
ON public.sections 
FOR SELECT 
TO public 
USING (true);

-- Optional: Allow anonymous updates/deletes if needed for the script
-- CREATE POLICY "Allow anonymous updates on sections" ON public.sections FOR UPDATE TO anon USING (true);
-- CREATE POLICY "Allow anonymous deletes on sections" ON public.sections FOR DELETE TO anon USING (true);
