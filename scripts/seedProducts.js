import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
if (SUPABASE_URL && SUPABASE_URL.includes('/rest/v1')) {
  SUPABASE_URL = SUPABASE_URL.split('/rest/v1')[0];
}
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const mockProducts = [
  {
    name: 'Paracetamol 500mg Tablets',
    slug: 'paracetamol-500mg',
    brand: 'Emzor',
    generic_name: 'Paracetamol',
    description: 'Effective relief from mild to moderate pain including headache, migraine, neuralgia, toothache, sore throat, period pain and general aches and pains.',
    price: 850,
    previous_price: 1000,
    stock_quantity: 150,
    low_stock_threshold: 20,
    prescription_required: false,
    active: true,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'c1'
  },
  {
    name: 'Vitamin C 1000mg + Zinc',
    slug: 'vitamin-c-1000mg-zinc',
    brand: 'Reload',
    generic_name: 'Ascorbic Acid + Zinc',
    description: 'Daily immune support supplement combining high-strength Vitamin C with Zinc for maximum protection and vitality.',
    price: 4500,
    previous_price: null,
    stock_quantity: 45,
    low_stock_threshold: 10,
    prescription_required: false,
    active: true,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1640582046416-831d102e3b2b?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'c2'
  },
  {
    name: 'Omron M3 Blood Pressure Monitor',
    slug: 'omron-m3-bp-monitor',
    brand: 'Omron',
    generic_name: null,
    description: 'Clinically validated automatic upper arm blood pressure monitor. Provides fast, easy, and accurate measurements.',
    price: 35000,
    previous_price: 38500,
    stock_quantity: 12,
    low_stock_threshold: 5,
    prescription_required: false,
    active: true,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'c3'
  },
  {
    name: 'Arthrotec 75',
    slug: 'arthrotec-75',
    brand: 'Pfizer',
    generic_name: 'Diclofenac / Misoprostol',
    description: 'Nonsteroidal anti-inflammatory drug (NSAID) used to treat osteoarthritis and rheumatoid arthritis in people at high risk of developing stomach or intestinal ulcers.',
    price: 8500,
    previous_price: null,
    stock_quantity: 25,
    low_stock_threshold: 10,
    prescription_required: true,
    active: true,
    featured: true,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'c1'
  }
];

async function seed() {
  console.log('Seeding products...');
  for (const product of mockProducts) {
    const { data, error } = await supabaseAdmin.from('products').upsert(
      { ...product, updated_at: new Date().toISOString() },
      { onConflict: 'slug' }
    );
    if (error) {
      console.error('Error inserting product:', error);
    } else {
      console.log(`Inserted: ${product.name}`);
    }
  }
  console.log('Done!');
}
seed();
