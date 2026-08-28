import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect(table) {
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (data && data.length > 0) {
    console.log(`Columns for ${table}:`, Object.keys(data[0]));
  } else {
    // get columns from information_schema via RPC or REST API
    // Actually we can do a trick: insert a totally invalid column to see if it lists columns in error? No.
    // We can fetch via raw fetch to PostgREST:
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.length === 0) {
        // use an OPTIONS request to get the OpenAPI spec
        const optionsRes = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        const openapi = await optionsRes.json();
        const definition = openapi.definitions[table];
        if (definition && definition.properties) {
          console.log(`Columns for ${table}:`, Object.keys(definition.properties));
        } else {
          console.log(`Could not find properties for ${table}`);
        }
      }
    }
  }
}

async function run() {
  await inspect('orders');
  await inspect('prescriptions');
  await inspect('consultations');
  await inspect('blog_posts');
}
run();
