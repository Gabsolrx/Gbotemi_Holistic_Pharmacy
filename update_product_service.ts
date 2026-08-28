import fs from 'fs';

let content = fs.readFileSync('src/services/productService.ts', 'utf8');

// 1. Add uploadBase64Image import
content = content.replace(
  "import { useAdminStore } from '../store/useAdminStore';",
  "import { useAdminStore } from '../store/useAdminStore';\nimport { uploadBase64Image } from '../utils/imageUpload';"
);

// 2. Add generateUUID
const uuidFn = `
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function isValidUUID(uuid: string) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
`;
content = content.replace("const STORAGE_KEY = 'gbotemi-products-inventory-v3';", "const STORAGE_KEY = 'gbotemi-products-inventory-v3';\n" + uuidFn);

// 3. Update ID generation in saveProduct
content = content.replace(
  "const productId = isEdit ? String(formData.id) : (formData.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`);",
  "const productId = isEdit ? String(formData.id) : (formData.id || generateUUID());\n    // Ensure even existing edits have valid UUIDs to sync properly\n    if (isEdit && !isValidUUID(productId)) {\n      console.warn('Cannot edit a product with non-UUID in Supabase. Will create as new instead if synced.');\n    }"
);

// 4. Update getProducts to include background sync
const backgroundSyncCode = `
    // Background sync to heal local data and push to Supabase
    setTimeout(async () => {
      try {
        const localItems = await getLocalStoredProducts();
        let needsSave = false;
        const fixedItems = [...localItems];
        
        for (let i = 0; i < fixedItems.length; i++) {
          const p = fixedItems[i];
          let changed = false;
          
          if (!isValidUUID(p.id)) {
            p.id = generateUUID();
            changed = true;
          }
          
          if (p.imageUrl && p.imageUrl.startsWith('data:image/')) {
            const newUrl = await uploadBase64Image(p.imageUrl, 'products', 'prod');
            if (newUrl !== p.imageUrl) {
              p.imageUrl = newUrl;
              p.image_url = newUrl;
              changed = true;
            }
          }
          
          if (changed) needsSave = true;
          
          // Upsert to Supabase
          try {
            const payload = {
              id: p.id, name: p.name, slug: p.slug, brand: p.brand,
              generic_name: p.generic_name, description: p.description,
              price: p.price, previous_price: p.previous_price || null,
              stock_quantity: p.stock_quantity, low_stock_threshold: p.low_stock_threshold,
              prescription_required: p.prescription_required, active: p.active,
              featured: p.featured, image_url: p.image_url, category: p.category
            };
            const { data } = await supabase.from('products').select('id').eq('id', p.id).single();
            if (!data) {
              await supabase.from('products').insert([payload]);
            } else if (changed) {
              await supabase.from('products').update(payload).eq('id', p.id);
            }
          } catch(e) {}
        }
        
        if (needsSave) {
          await saveToLocalStorage(fixedItems);
          notifyInventoryUpdate();
        }
      } catch(err) {
        console.error('Background sync failed', err);
      }
    }, 2000);
`;

content = content.replace(
  "    if (options?.limit && list.length > options.limit) {\n      list = list.slice(0, options.limit);\n    }\n    return list;\n  },",
  "    if (options?.limit && list.length > options.limit) {\n      list = list.slice(0, options.limit);\n    }\n" + backgroundSyncCode + "\n    return list;\n  },"
);

fs.writeFileSync('src/services/productService.ts', content);
