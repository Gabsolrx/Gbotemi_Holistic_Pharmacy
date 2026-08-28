import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL.split('/rest/v1')[0]; 
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_statement: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';"
  });
  console.log("Columns orders:", data);

  const { data: d2 } = await supabase.rpc('execute_sql', {
    sql_statement: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'order_items';"
  });
  console.log("Columns order_items:", d2);
}
run();
