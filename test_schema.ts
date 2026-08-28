import { createClient } from '@supabase/supabase-js';
let url = process.env.VITE_SUPABASE_URL || '';
if (url.includes('/rest/v1')) url = url.split('/rest/v1')[0];
const supabase = createClient(url, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.rpc('get_schema_info');
  console.log(error ? "No RPC" : data);
}
run();
