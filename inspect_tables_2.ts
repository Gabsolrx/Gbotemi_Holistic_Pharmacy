import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const tables = ['blog_posts', 'cms_settings'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).insert([{ id: '00000000-0000-0000-0000-000000000000' }]);
    console.log(`\n--- ${table} insertion error ---`);
    console.log(error?.message || "No error (inserted)");
  }
}
inspect();
