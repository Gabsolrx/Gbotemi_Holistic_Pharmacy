import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { mockProducts } from './src/data/mockProducts.js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) { console.error(error); return; }
  
  let deletedCount = 0;
  for (const p of data) {
    const isMock = mockProducts.find(mp => mp.name === p.name && Math.abs(mp.price - p.price) < 1);
    if (isMock) {
      await supabase.from('products').delete().eq('id', p.id);
      deletedCount++;
      console.log(`Deleted mock: ${p.name} - ${p.price}`);
    } else {
      console.log(`Kept product: ${p.name} - ${p.price}`);
    }
  }
  console.log(`Deleted ${deletedCount} mock products from Supabase.`);
}
run();
