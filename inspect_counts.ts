import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const tables = ['blog_posts', 'cms_settings', 'consultations', 'order_items', 'orders', 'prescriptions', 'profiles', 'products'];
  let allGood = true;
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error || count === 0) {
      allGood = false;
      console.log(`Failed or empty: ${table}`);
    } else {
      console.log(`${table}: ${count} rows`);
    }
  }
  if (allGood) console.log("All tables populated successfully.");
}
inspect();
