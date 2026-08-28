import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase.from('blog_posts').select('*').limit(1);
  if (data && data.length > 0) {
    console.log("Columns:", Object.keys(data[0]));
  } else {
    // let's insert empty to see error
    const { error: err2 } = await supabase.from('blog_posts').insert([{ id: 'test' }]);
    console.log("Insert error blog_posts:", err2?.message);
    
    // fetch columns by inspecting information_schema via RPC or just running a raw query if possible
  }
}
inspect();
