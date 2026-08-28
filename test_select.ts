import { createClient } from '@supabase/supabase-js';

let url = process.env.VITE_SUPABASE_URL || '';
if (url.includes('/rest/v1')) {
  url = url.split('/rest/v1')[0];
}

const supabase = createClient(url, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('prescriptions').select(`*, user_id!inner(first_name)`).limit(1);
  console.log("With user_id:", error ? error.message : "Success");
  
  const { data: d3, error: e3 } = await supabase.from('prescriptions').select('*').limit(1);
  console.log("Without relation:", e3 ? e3.message : JSON.stringify(d3));
}
run();
