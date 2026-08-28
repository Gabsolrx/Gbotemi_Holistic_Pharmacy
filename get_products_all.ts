import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('id, name, price, created_at, updated_at').order('created_at', { ascending: true });
  if (error) console.error(error);
  if (data) {
    data.forEach((p, idx) => {
      console.log(`${idx}: ${p.name} - ${p.price} - ${p.id} - ${p.created_at}`);
    });
  }
}
run();
