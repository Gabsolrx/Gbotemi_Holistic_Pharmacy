import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export function useProducts(limit?: number) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts({ onlyActive: true, limit });
        if (isMounted) {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    const handleUpdate = () => {
      fetchProducts();
    };

    window.addEventListener('products-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('products-updated', handleUpdate);
    };
  }, [limit]);

  return { products, isLoading };
}

