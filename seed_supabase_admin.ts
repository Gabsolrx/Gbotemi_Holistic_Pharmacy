import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { mockProducts } from './src/data/mockProducts';

let supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('/rest/v1')) { 
  supabaseUrl = supabaseUrl.split('/rest/v1')[0]; 
}
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding products using SERVICE_ROLE_KEY...');
  
  let insertedCount = 0;
  let updatedCount = 0;
  
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
      category: item.category // Using category as TEXT based on actual schema
    };
    
    const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    
    if (existing) {
      const { error } = await supabase.from('products').update(supabasePayload).eq('id', existing.id);
      if (error) console.error("Error updating", item.name, error.message);
      else updatedCount++;
    } else {
      const { error } = await supabase.from('products').insert([supabasePayload]);
      if (error) console.error("Error inserting", item.name, error.message);
      else insertedCount++;
    }
  }
  
  console.log(`Done. Inserted: ${insertedCount}, Updated: ${updatedCount}`);
}
seed();
