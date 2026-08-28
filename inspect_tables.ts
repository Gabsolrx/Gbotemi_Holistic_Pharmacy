import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const tables = ['blog_posts', 'cms_settings', 'consultations', 'order_items', 'orders', 'prescriptions', 'profiles'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    console.log(`\n--- ${table} ---`);
    if (error) {
      console.log("Error:", error.message);
    } else {
      console.log("Exists. Count:", data.length);
      if (data.length > 0) {
        console.log("Columns:", Object.keys(data[0]));
      } else {
        // Try to insert a dummy and get column error to see columns, or just use rpc if possible
      }
    }
  }
}
inspect();
