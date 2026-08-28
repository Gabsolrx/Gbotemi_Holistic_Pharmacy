import { get as idbGet, set as idbSet } from 'idb-keyval';
import { Product } from '../types';
import { mockProducts } from '../data/mockProducts';
import { supabase } from '../lib/supabase';
import { useAdminStore } from '../store/useAdminStore';
import { uploadBase64Image } from '../utils/imageUpload';

const STORAGE_KEY = 'gbotemi-products-inventory-v3';

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


// Helper to normalize product properties to support both camelCase and snake_case
export function normalizeProduct(item: any): any {
  if (!item) return null;

  const id = String(item.id || item.productId || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`);
  const name = item.name || 'Untitled Product';
  const slug = item.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `product-${id}`;
  const brand = item.brand || '';
  const genericName = item.generic_name || item.genericName || '';
  const description = item.description || '';
  const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
  const previousPrice = item.previous_price !== undefined ? Number(item.previous_price) : item.previousPrice !== undefined ? Number(item.previousPrice) : undefined;
  const stockQuantity = item.stock_quantity !== undefined ? Number(item.stock_quantity) : item.stockQuantity !== undefined ? Number(item.stockQuantity) : 0;
  const lowStockThreshold = item.low_stock_threshold !== undefined ? Number(item.low_stock_threshold) : item.lowStockThreshold !== undefined ? Number(item.lowStockThreshold) : 10;
  const prescriptionRequired = item.prescription_required !== undefined ? Boolean(item.prescription_required) : item.prescriptionRequired !== undefined ? Boolean(item.prescriptionRequired) : false;
  const active = item.active !== undefined ? Boolean(item.active) : true;
  const featured = item.featured !== undefined ? Boolean(item.featured) : false;
  const imageUrl = item.image_url || item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400';
  const category = item.category || item.categoryId || 'General Healthcare';
  const createdAt = item.created_at || item.createdAt || new Date().toISOString();
  const updatedAt = item.updated_at || item.updatedAt || new Date().toISOString();

  return {
    ...item,
    id,
    name,
    slug,
    brand,
    genericName,
    generic_name: genericName,
    description,
    price,
    previousPrice,
    previous_price: previousPrice,
    stockQuantity,
    stock_quantity: stockQuantity,
    lowStockThreshold,
    low_stock_threshold: lowStockThreshold,
    prescriptionRequired,
    prescription_required: prescriptionRequired,
    active,
    featured,
    imageUrl,
    image_url: imageUrl,
    category,
    categoryId: category,
    createdAt,
    created_at: createdAt,
    updatedAt,
    updated_at: updatedAt,
  };
}

// Get products from localStorage
async function getLocalStoredProducts(): Promise<any[]> {
  try {
    let parsed: any = await idbGet(STORAGE_KEY);
    
    // Migration from localStorage if idb is empty
    if (!parsed) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        parsed = JSON.parse(raw);
        // Clean up old localStorage to free up the quota!
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    

    if (Array.isArray(parsed) && parsed.length > 0) {
      // CLEANUP: Remove mock products and duplicates from local storage
      const mockNames = new Set(mockProducts.map(m => m.name));
      let filtered = parsed.filter(p => {
        // Keep if it's NOT a mock product name
        if (!mockNames.has(p.name)) return true;
        // If it IS a mock product name, keep it ONLY if the user uploaded a custom image for it
        if (p.imageUrl && (p.imageUrl.startsWith('data:image/') || p.imageUrl.includes('supabase.co/storage'))) return true;
        if (p.image_url && (p.image_url.startsWith('data:image/') || p.image_url.includes('supabase.co/storage'))) return true;
        return false;
      });
      
      // Deduplicate by name (keep latest/UUID version)
      const uniqueMap = new Map();
      filtered.forEach(p => {
        const existing = uniqueMap.get(p.name);
        if (!existing || (isValidUUID(p.id) && !isValidUUID(existing.id))) {
           uniqueMap.set(p.name, p);
        }
      });
      filtered = Array.from(uniqueMap.values());
      
      return filtered.map(normalizeProduct);
    }

  } catch (err) {
    console.warn('Error reading products from storage:', err);
  }

  return [];
}

// Save products to localStorage
async function saveToLocalStorage(products: any[]) {
  try {
    await idbSet(STORAGE_KEY, products);
  } catch (err: any) {
    console.error('Error saving products to IndexedDB:', err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('inventory-error', { detail: err.message }));
    }
  }
}

// Notify all app components of inventory changes
function notifyInventoryUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('products-updated'));
  }
}

export const productService = {
  // Fetch all products (with Supabase sync & localStorage backup)
  async getProducts(options?: { onlyActive?: boolean; limit?: number }): Promise<any[]> {
    let list: any[] = [];
    let fetchedFromRemote = false;

    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.onlyActive) {
        query = query.eq('active', true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        list = data.map(normalizeProduct);
        fetchedFromRemote = true;

        // Merge remote items with local storage to preserve custom newly created items
        const localList = await getLocalStoredProducts();
        const mergedMap = new Map<string, any>();
        
        // Merge based on most recent updated_at timestamp
        localList.forEach(p => mergedMap.set(p.id, p));
        
        list.forEach(remoteProduct => {
          const localProduct = mergedMap.get(remoteProduct.id);
          if (!localProduct) {
            mergedMap.set(remoteProduct.id, remoteProduct);
          } else {
            // Compare timestamps, prefer the more recently updated one
            const remoteTime = new Date(remoteProduct.updated_at || remoteProduct.created_at || 0).getTime();
            const localTime = new Date(localProduct.updated_at || localProduct.created_at || 0).getTime();
            
            if (remoteTime > localTime) {
              mergedMap.set(remoteProduct.id, remoteProduct);
            }
          }
        });

        const merged = Array.from(mergedMap.values());
        await saveToLocalStorage(merged);
        list = merged;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local inventory:', err);
    }

    if (!fetchedFromRemote) {
      list = await getLocalStoredProducts();
    }

    if (options?.onlyActive) {
      list = list.filter(p => p.active !== false);
    }

    if (options?.limit && list.length > options.limit) {
      list = list.slice(0, options.limit);
    }

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

    return list;
  },

  // Get a single product by slug or ID
  async getProductBySlug(slugOrId: string): Promise<any | null> {
    if (!slugOrId) return null;

    // 1. Try Supabase first
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .maybeSingle();

      if (!error && data) {
        return normalizeProduct(data);
      }
    } catch (err) {
      console.warn('Supabase getProductBySlug query error:', err);
    }

    // 2. Fallback to local products
    const local = await getLocalStoredProducts();
    const found = local.find(p => p.slug === slugOrId || p.id === slugOrId);
    return found ? normalizeProduct(found) : null;
  },

  // Save (Create or Update) a product
  async saveProduct(formData: any): Promise<{ success: boolean; product: any; error?: string }> {
    const isEdit = Boolean(formData.id);
    const existingList = await getLocalStoredProducts();

    // Prepare slug
    let slug = formData.slug ? String(formData.slug).trim() : '';
    if (!slug && formData.name) {
      slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (!slug) {
      slug = `product-${Date.now()}`;
    }

    const productId = isEdit ? String(formData.id) : (formData.id || generateUUID());
    // Ensure even existing edits have valid UUIDs to sync properly
    if (isEdit && !isValidUUID(productId)) {
      console.warn('Cannot edit a product with non-UUID in Supabase. Will create as new instead if synced.');
    }

    // Prepare normalized entity
    const fullProduct = normalizeProduct({
      ...formData,
      id: productId,
      slug,
      updated_at: new Date().toISOString(),
      created_at: formData.created_at || formData.createdAt || new Date().toISOString(),
    });

    // 1. Persist to local storage immediately
    let updatedList: any[];
    if (isEdit) {
      updatedList = existingList.map(p => (p.id === productId ? fullProduct : p));
    } else {
      updatedList = [fullProduct, ...existingList];
    }
    await saveToLocalStorage(updatedList);

    // 2. Update Zustand store for Admin
    try {
      const adminStore = useAdminStore.getState();
      if (isEdit) {
        adminStore.updateProduct(productId, fullProduct);
      } else {
        adminStore.addProduct(fullProduct);
      }
    } catch (e) {
      console.warn('Failed to update admin zustand store:', e);
    }

    // 3. Attempt to persist to Supabase in parallel
    try {
      const supabasePayload = {
        name: fullProduct.name,
        slug: fullProduct.slug,
        brand: fullProduct.brand,
        generic_name: fullProduct.generic_name,
        description: fullProduct.description,
        price: fullProduct.price,
        previous_price: fullProduct.previous_price || null,
        stock_quantity: fullProduct.stock_quantity,
        low_stock_threshold: fullProduct.low_stock_threshold,
        prescription_required: fullProduct.prescription_required,
        active: fullProduct.active,
        featured: fullProduct.featured,
        image_url: fullProduct.image_url,
        category: fullProduct.category,
      };

      if (isEdit) {
        await supabase
          .from('products')
          .update(supabasePayload)
          .eq('id', productId);
      } else {
        await supabase
          .from('products')
          .insert([{ ...supabasePayload, id: productId }]);
      }
    } catch (supaErr) {
      console.warn('Supabase remote write error (persisted locally):', supaErr);
    }

    // 4. Notify listeners
    notifyInventoryUpdate();

    return {
      success: true,
      product: fullProduct,
    };
  },

  // Delete a product
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const list = await getLocalStoredProducts();
    const updated = list.filter(p => p.id !== id);
    await saveToLocalStorage(updated);

    try {
      useAdminStore.getState().deleteProduct(id);
    } catch (e) {
      // ignore
    }

    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase remote delete error (deleted locally):', err);
    }

    notifyInventoryUpdate();
    return { success: true };
  },

  // Archive / set to draft
  async archiveProduct(id: string): Promise<{ success: boolean }> {
    const list = await getLocalStoredProducts();
    const updated = list.map(p => (p.id === id ? { ...p, active: false, status: 'draft' } : p));
    await saveToLocalStorage(updated);

    try {
      await supabase.from('products').update({ active: false }).eq('id', id);
    } catch (err) {
      console.warn('Supabase remote archive error (archived locally):', err);
    }

    notifyInventoryUpdate();
    return { success: true };
  }
};
