import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users.users[0].id;
  const { data: products } = await supabase.from('products').select('id, name, price').limit(3);

  // let's try some standard statuses
  const { data: orderData, error: orderErr } = await supabase.from('orders').insert([
    {
      user_id: userId,
      customer_name: "Mock User",
      customer_email: "mockuser@example.com",
      status: 'pending',
      total_amount: 15500,
      shipping_address: "123 Main St, Lagos",
      payment_reference: 'pay_123456'
    }
  ]).select();

  if (orderErr) {
    console.log("Order insert error:", orderErr.message);
  } else if (orderData && products && products.length > 0) {
    const orderItems = orderData.flatMap((order, idx) => [
      {
        order_id: order.id,
        product_id: products[idx % products.length].id,
        product_name: products[idx % products.length].name,
        quantity: 2,
        price_at_time: products[idx % products.length].price
      }
    ]);
    const { error: oiErr } = await supabase.from('order_items').insert(orderItems);
    if (oiErr) console.log("Order items insert error:", oiErr.message);
    else console.log("Orders & Items seeded successfully!");
  }
}
seed();
