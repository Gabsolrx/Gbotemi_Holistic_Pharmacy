import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase.rpc('execute_sql', {
    sql_statement: `
      -- Allow public uploads and reads for 'products' and 'cms' buckets
      CREATE POLICY "public_read_products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
      CREATE POLICY "public_insert_products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
      CREATE POLICY "public_update_products" ON storage.objects FOR UPDATE USING (bucket_id = 'products');
      
      CREATE POLICY "public_read_cms" ON storage.objects FOR SELECT USING (bucket_id = 'cms');
      CREATE POLICY "public_insert_cms" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms');
      CREATE POLICY "public_update_cms" ON storage.objects FOR UPDATE USING (bucket_id = 'cms');
    `
  });
  console.log("Policy creation:", error ? error.message : "Success");
}
run();
