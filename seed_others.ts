import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  console.log("Getting a user ID...");
  let userId;
  
  const { data: users } = await supabase.auth.admin.listUsers();
  if (users && users.users.length > 0) {
    userId = users.users[0].id;
  } else {
    // create one
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email: 'mockuser@example.com',
      password: 'password123',
      email_confirm: true
    });
    if (!authErr && authUser) {
      userId = authUser.user.id;
      await supabase.from('profiles').insert({
        id: userId,
        email: 'mockuser@example.com',
        first_name: 'Mock',
        last_name: 'User',
        phone: '08012345678',
        role: 'customer'
      });
    }
  }

  if (!userId) {
    console.log("No user ID available.");
    return;
  }

  console.log(`Using User ID: ${userId}`);

  const { data: products } = await supabase.from('products').select('id, name, price').limit(3);

  // 1. ORDERS & ORDER_ITEMS
  console.log("Seeding orders...");
  const { data: orderData, error: orderErr } = await supabase.from('orders').insert([
    {
      user_id: userId,
      customer_name: "Mock User",
      customer_email: "mockuser@example.com",
      status: 'completed',
      total_amount: 15500,
      shipping_address: "123 Main St, Lagos",
      payment_reference: 'pay_123456'
    },
    {
      user_id: userId,
      customer_name: "Mock User",
      customer_email: "mockuser@example.com",
      status: 'pending',
      total_amount: 5000,
      shipping_address: "45 Broad St, Abuja",
      payment_reference: 'pay_789012'
    }
  ]).select();

  if (orderErr) console.log("Order insert error:", orderErr.message);

  if (orderData && products && products.length > 0) {
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
  }

  // 2. PRESCRIPTIONS
  console.log("Seeding prescriptions...");
  const { error: rxErr } = await supabase.from('prescriptions').insert([
    {
      user_id: userId,
      file_url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80",
      customer_notes: "Need this urgently",
      status: 'pending'
    },
    {
      user_id: userId,
      file_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
      customer_notes: "Refill for next month",
      status: 'approved'
    }
  ]);
  if (rxErr) console.log("Prescriptions insert error:", rxErr.message);

  // 3. CONSULTATIONS
  console.log("Seeding consultations...");
  const { error: consultErr } = await supabase.from('consultations').insert([
    {
      user_id: userId,
      preferred_date: new Date().toISOString().split('T')[0],
      preferred_time: '14:00',
      reason: 'Medication review',
      status: 'scheduled'
    },
    {
      user_id: userId,
      preferred_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
      preferred_time: '10:00',
      reason: 'General enquiry',
      status: 'completed'
    }
  ]);
  if (consultErr) console.log("Consultations insert error:", consultErr.message);

  // 4. BLOG POSTS
  console.log("Seeding blog posts...");
  const blogPosts = [
    {
      title: 'The Complete Guide to Holistic Pharmacy',
      slug: 'the-complete-guide-to-holistic-pharmacy',
      excerpt: 'Discover how combining traditional medicine with holistic wellness can lead to better health outcomes.',
      content: '<p>Holistic pharmacy is not just about dispensing medication...</p>',
      featured_image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800',
      published: true
    },
    {
      title: 'Managing Hypertension Naturally',
      slug: 'managing-hypertension-naturally',
      excerpt: 'Learn effective lifestyle changes and dietary adjustments to help manage high blood pressure effectively.',
      content: '<p>High blood pressure, often called hypertension...</p>',
      featured_image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800',
      published: true
    }
  ];
  const { error: blogErr } = await supabase.from('blog_posts').insert(blogPosts);
  if (blogErr) console.log("Blog posts insert error:", blogErr.message);

  // 5. CMS SETTINGS
  console.log("Seeding CMS settings...");
  const cmsSettings = [
    { key: 'announcement_bar', value: '{"enabled": true, "text": "Welcome to our store!"}' },
    { key: 'contact_info', value: '{"phone": "08012345678", "email": "info@gbotemi.com"}' },
    { key: 'hero_section', value: '{"title": "Your Health, Our Priority", "subtitle": "Quality medications delivered to your door"}' }
  ];
  const { error: cmsErr } = await supabase.from('cms_settings').insert(cmsSettings);
  if (cmsErr) console.log("CMS settings insert error:", cmsErr.message);

  console.log("Done!");
}

seed();
