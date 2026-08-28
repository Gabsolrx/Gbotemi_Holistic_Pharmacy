import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('id, name, price, image_url').order('created_at', { ascending: false });
  if (error) { console.error(error); return; }
  
  data.forEach(p => console.log(`${p.id} - ${p.name} - ${p.price} - ${p.image_url?.substring(0,40)}`));
}
run();
