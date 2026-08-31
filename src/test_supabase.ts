import { supabase } from './lib/supabase';

async function testConnection() {
  console.log('Testing Supabase connection...');
  try {
    const { data: courses, error: coursesError } = await supabase.from('courses').select('count', { count: 'exact' });
    if (coursesError) throw coursesError;
    console.log('Courses count:', courses);

    const { data: sections, error: sectionsError } = await supabase.from('sections').select('count', { count: 'exact' });
    if (sectionsError) throw sectionsError;
    const { data: resources, error: resourcesError } = await supabase.from('resources').select('*').limit(5);
    if (resourcesError) throw resourcesError;
    console.log('Resources count (first 5):', resources);

    console.log('Connection successful!');
  } catch (error: any) {
    console.error('Supabase Error:', error.message);
  }
}

testConnection();
