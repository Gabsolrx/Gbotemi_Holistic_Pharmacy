import { createClient } from '@supabase/supabase-js';
let url = process.env.VITE_SUPABASE_URL || '';
if (url.includes('/rest/v1')) url = url.split('/rest/v1')[0];
const supabase = createClient(url, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('prescriptions').select(`*, profiles!prescriptions_customer_id_fkey(first_name, last_name, email)`).limit(1);
  console.log("With profiles!fkey:", error ? error.message : "Success");
}
run();
