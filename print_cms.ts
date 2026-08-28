import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
let supabaseUrl = process.env.VITE_SUPABASE_URL.split('/rest/v1')[0]; 
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const cms = await supabase.from('cms_settings').select('*');
  console.log(JSON.stringify(cms.data, null, 2));
}
run();
