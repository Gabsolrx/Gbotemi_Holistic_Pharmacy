import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'products' });
  if (error) console.log("RPC failed:", error.message);
  
  // Alternative: query a single row to see types
  const { data: d2, error: e2 } = await supabase.from('products').select('*').limit(1);
  if (d2) {
    console.log("Row:", JSON.stringify(d2[0], null, 2));
  }
}
run();
