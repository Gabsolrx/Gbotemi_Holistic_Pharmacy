import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) console.error("Error listing buckets:", error);
  else console.log("Buckets:", data.map(b => b.name));
  
  // Try to create the buckets
  const { error: e1 } = await supabase.storage.createBucket('products', { public: true });
  if (e1) console.log("Create products bucket err:", e1.message);
  
  const { error: e2 } = await supabase.storage.createBucket('cms', { public: true });
  if (e2) console.log("Create cms bucket err:", e2.message);
  
  console.log("Done checking buckets.");
}
run();
