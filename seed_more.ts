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
  const { data: products } = await supabase.from('products').select('id, name, price').limit(5);

  const statuses = ['pending', 'processing', 'shipped', 'delivered'];

  for (let i=0; i<4; i++) {
    const { data: orderData } = await supabase.from('orders').insert([
      {
        user_id: userId,
        customer_name: "Mock User",
        customer_email: "mockuser@example.com",
        status: statuses[i],
        total_amount: Math.floor(Math.random() * 20000) + 1000,
        shipping_address: `${i+10} Random Ave, Lagos`,
        payment_reference: `pay_rand_${Math.floor(Math.random() * 1000000)}`
      }
    ]).select();

    if (orderData && orderData.length > 0 && products.length > i) {
      await supabase.from('order_items').insert([
        {
          order_id: orderData[0].id,
          product_id: products[i].id,
          product_name: products[i].name,
          quantity: Math.floor(Math.random() * 3) + 1,
          price_at_time: products[i].price
        }
      ]);
    }
  }
  console.log("Seeded more orders.");
}
seed();
