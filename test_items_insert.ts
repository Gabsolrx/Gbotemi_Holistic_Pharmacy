import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.VITE_SUPABASE_URL.split('/rest/v1')[0]; 
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: orderData, error: orderError } = await supabase
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
    
  if (orderError) {
    console.log("Order Error:", orderError);
    return;
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .insert([
      {
        order_id: orderData.id,
        product_id: '8ef93021-36ba-4a11-b0e5-da7361907722', // some uuid, let's just use null to be safe if nullable, or skip
        product_name: 'Test Product',
        quantity: 1,
        price_at_time: 100
      }
    ])
    .select();
    
  console.log("Items Error:", itemsError);
}
run();
