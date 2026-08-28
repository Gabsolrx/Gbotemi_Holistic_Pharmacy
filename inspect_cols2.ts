import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect(table) {
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
inspect('cms_settings');
inspect('order_items');
