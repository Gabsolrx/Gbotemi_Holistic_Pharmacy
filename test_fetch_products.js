import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Products fetch error:', error);
  } else {
    console.log('Products fetched:', data.length);
  }
  
  const cms = await supabase.from('cms_settings').select('*');
  if (cms.error) console.error('CMS fetch error:', cms.error);
  else console.log('CMS settings fetched:', cms.data.length);
}
run();
