import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let url = process.env.VITE_SUPABASE_URL || '';
if (url.includes('/rest/v1')) url = url.split('/rest/v1')[0];
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log('Buckets:', data?.map(b => b.name), error);
}
check();
