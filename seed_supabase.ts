import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl.includes('/rest/v1')) { supabaseUrl = supabaseUrl.split('/rest/v1')[0]; }
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
import { mockProducts } from './src/data/mockProducts';

async function seed() {
  console.log('Seeding products...');
  for (const item of mockProducts) {
    const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const supabasePayload = {
      name: item.name,
      slug: slug,
      brand: item.brand,
      genericName: item.genericName || item.genericName,
      description: item.description,
      price: item.price,
      previous_price: item.previousPrice,
      stockQuantity: item.stockQuantity || item.stockQuantity,
      low_stock_threshold: item.lowStockThreshold,
      prescription_required: item.prescriptionRequired || false,
      active: item.active !== false,
      featured: item.featured || false,
      image_url: item.imageUrl,
      category: item.category,
    };
    
    // check if it exists
    const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    
    if (existing) {
      await supabase.from('products').update(supabasePayload).eq('id', existing.id);
      console.log('Updated', item.name);
    } else {
      await supabase.from('products').insert([supabasePayload]);
      console.log('Inserted', item.name);
    }
  }
  console.log('Done.');
}

seed();
