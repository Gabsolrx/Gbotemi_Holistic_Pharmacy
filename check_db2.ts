import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL.split('/rest/v1')[0]; 
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('order_items').select('*').limit(1);
  console.log("Data order_items:", data);
  console.log("Error order_items:", error);
}
run();
