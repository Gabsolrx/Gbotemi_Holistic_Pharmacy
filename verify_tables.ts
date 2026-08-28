import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const cms = await supabase.from('cms_settings').select('id').limit(1);
  console.log("cms_settings table:", cms.error ? cms.error.message : "Exists, rows: " + cms.data?.length);
  
  const profiles = await supabase.from('profiles').select('id').limit(1);
  console.log("profiles table:", profiles.error ? profiles.error.message : "Exists, rows: " + profiles.data?.length);
}
run();
