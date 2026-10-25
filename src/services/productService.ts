import { supabase } from '../lib/supabase';
import { mockProducts } from '../data/mockProducts';

const LOCAL_PRODUCTS_KEY = 'gbotemi_products_cache_v1';

// Normalizer to guarantee consistent field naming across UI components
function normalizeProduct(p: any) {
  if (!p) return null;
  return {
    ...p,
    id: String(p.id),
    name: p.name || 'Healthcare Product',
    slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'product'),
    brand: p.brand || 'Holistic Pharmacy',
    generic_name: p.generic_name || p.genericName || '',
    genericName: p.generic_name || p.genericName || '',
    description: p.description || '',
    price: Number(p.price) || 0,
    previous_price: p.previous_price ? Number(p.previous_price) : undefined,
    stock_quantity: p.stock_quantity !== undefined ? Number(p.stock_quantity) : (p.stockQuantity !== undefined ? Number(p.stockQuantity) : 50),
    stockQuantity: p.stock_quantity !== undefined ? Number(p.stock_quantity) : (p.stockQuantity !== undefined ? Number(p.stockQuantity) : 50),
    low_stock_threshold: p.low_stock_threshold !== undefined ? Number(p.low_stock_threshold) : (p.lowStockThreshold || 10),
    prescription_required: Boolean(p.prescription_required ?? p.prescriptionRequired),
    prescriptionRequired: Boolean(p.prescription_required ?? p.prescriptionRequired),
    active: p.active ?? true,
    featured: Boolean(p.featured),
    category: p.category || 'General Health',
    imageUrl: p.image_url || p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400',
    image_url: p.image_url || p.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400',
    rating: Number(p.rating) || 4.8,
  };
}

export const productService = {
  async getProducts(options?: { onlyActive?: boolean; limit?: number }): Promise<any[]> {
    try {
      let query = supabase.from('products').select('*');
      
      if (options?.onlyActive) {
        query = query.eq('active', true);
      }
      
      query = query.order('created_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const normalized = data.map(normalizeProduct);
        try {
          localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(normalized));
        } catch {}
        return normalized;
      }
    } catch (err) {
      console.warn('Supabase products fetch failed, using fallback:', err);
    }

    // Try cached local storage
    try {
      const cached = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      if (cached) {
        let parsed = JSON.parse(cached);
        if (options?.onlyActive) {
          parsed = parsed.filter((p: any) => p.active !== false);
        }
        if (options?.limit) {
          parsed = parsed.slice(0, options.limit);
        }
        return parsed.map(normalizeProduct);
      }
    } catch {}

    // Ultimate fallback: mockProducts
    let fallback = [...mockProducts].map(normalizeProduct);
    if (options?.onlyActive) {
      fallback = fallback.filter((p) => p.active !== false);
    }
    if (options?.limit) {
      fallback = fallback.slice(0, options.limit);
    }
    return fallback;
  },

  async getProductBySlug(slug: string): Promise<any | null> {
    if (!slug) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return normalizeProduct(data);
      }
    } catch (err) {
      console.warn('Error fetching product by slug from Supabase:', err);
    }

    // Search local cache
    try {
      const cached = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const found = parsed.find((p: any) => p.slug === slug || p.id === slug);
        if (found) return normalizeProduct(found);
      }
    } catch {}

    // Search mock products
    const foundMock = mockProducts.find((p: any) => p.slug === slug || String(p.id) === slug);
    return foundMock ? normalizeProduct(foundMock) : null;
  },

  async getProductById(id: string): Promise<any | null> {
    if (!id) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return normalizeProduct(data);
      }
    } catch (err) {
      console.warn('Error fetching product by id from Supabase:', err);
    }

    const foundMock = mockProducts.find((p: any) => String(p.id) === String(id));
    return foundMock ? normalizeProduct(foundMock) : null;
  },

  async saveProduct(payload: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const record = {
        name: payload.name,
        slug: payload.slug,
        brand: payload.brand || 'Holistic Pharmacy',
        generic_name: payload.generic_name || payload.genericName || '',
        description: payload.description || '',
        price: Number(payload.price) || 0,
        previous_price: payload.previous_price ? Number(payload.previous_price) : null,
        stock_quantity: Number(payload.stock_quantity) || 0,
        low_stock_threshold: Number(payload.low_stock_threshold) || 10,
        prescription_required: Boolean(payload.prescription_required),
        active: payload.active ?? true,
        featured: Boolean(payload.featured),
        category: payload.category || 'General Health',
        image_url: payload.image_url || payload.imageUrl || '',
        updated_at: new Date().toISOString(),
      };

      let resultData = null;

      if (payload.id) {
        const { data, error } = await supabase
          .from('products')
          .update(record)
          .eq('id', payload.id)
          .select()
          .single();

        if (error) throw error;
        resultData = data;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([{ ...record, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        resultData = data;
      }

      // Update local cache
      try {
        const currentProducts = await this.getProducts();
        const updatedList = payload.id
          ? currentProducts.map(p => (p.id === payload.id ? normalizeProduct(resultData || record) : p))
          : [normalizeProduct(resultData || record), ...currentProducts];
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updatedList));
      } catch {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('products-updated'));
      }

      return { success: true, data: resultData };
    } catch (error: any) {
      console.error('Failed to save product in Supabase:', error);
      return { success: false, error: error.message || 'Failed to save product' };
    }
  },

  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      try {
        const cached = localStorage.getItem(LOCAL_PRODUCTS_KEY);
        if (cached) {
          const parsed = JSON.parse(cached).filter((p: any) => String(p.id) !== String(id));
          localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(parsed));
        }
      } catch {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('products-updated'));
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete product' };
    }
  },

  async archiveProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('products-updated'));
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to archive product' };
    }
  },
};

export default productService;
