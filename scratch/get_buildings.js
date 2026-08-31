import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing keys in process.env:", { supabaseUrl, supabaseAnonKey });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBuildings() {
  const { data, error } = await supabase.from('buildings').select('*').order('id', { ascending: true });
  if (error) {
    console.error("Supabase Error:", error);
    return;
  }
  console.log("Buildings loaded from database:", data.length);
  data.forEach(b => {
    console.log(`ID: ${b.id} | Name: ${b.name_ar} | image_url: ${b.image_url} | imageUrl: ${b.imageUrl}`);
  });
}

checkBuildings();
