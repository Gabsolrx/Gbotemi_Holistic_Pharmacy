import { Link } from 'react-router-dom';
import { ProductCard } from '../ui/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';

export function FeaturedProducts() {
  const { products, isLoading } = useProducts();
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    cmsService.getConfig().then(cfg => {
      if (cfg.featuredProductOrder) {
        setOrder(cfg.featuredProductOrder);
      }
    });
    const handleUpdate = () => {
      cmsService.getConfig().then(cfg => {
        if (cfg.featuredProductOrder) setOrder(cfg.featuredProductOrder);
      });
    };
    window.addEventListener('cms-updated', handleUpdate);
    return () => window.removeEventListener('cms-updated', handleUpdate);
  }, []);

  // Filter featured products
  const featuredOnly = products.filter(p => p.featured);
  
  // Sort them according to order
  const sorted = [...featuredOnly].sort((a, b) => {
    const idxA = order.indexOf(a.id);
    const idxB = order.indexOf(b.id);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  }).slice(0, 4);

  // Fallback if no featured products
  const displayProducts = sorted.length > 0 ? sorted : products.slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Top quality healthcare essentials for you.</p>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex text-primary-700 font-medium hover:text-primary-800 hover:underline">
            View All Products
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/shop" className="inline-flex text-primary-700 font-medium hover:text-primary-800">
            View All Products &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
