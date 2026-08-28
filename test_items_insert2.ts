import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL.split('/rest/v1')[0]; 
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: orderData } = await supabase
    .from('orders')
    .insert({
      customer_name: 'Test',
      customer_email: 'test@example.com',
      shipping_address: '123',
      total_amount: 100,
      status: 'pending',
      payment_reference: 'TEST' + Date.now(),
    })
    .select()
    .single();

  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .insert([
      {
        order_id: orderData.id,
        product_name: 'Test Product',
        quantity: 1,
        price_at_time: 100
      }
    ])
    .select();
    
  console.log("Items Error:", itemsError);
}
run();
