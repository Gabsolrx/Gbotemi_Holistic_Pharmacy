import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL.split('/rest/v1')[0]; 
const supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const email = `test.user.${Date.now()}@gmail.com`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: { first_name: 'Test', last_name: 'User', phone: '123' }
    }
  });
  console.log("Signup:", error ? error.message : data.user?.id);
  
  if (data.user) {
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', data.user.id).single();
    console.log("Profile auto-created:", !!profile);
    
    // cleanup
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
  }
}
run();
