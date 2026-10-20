import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Loader2, PackageOpen } from 'lucide-react';
import { ProductFilters } from '../components/shop/ProductFilters';
import { ProductCard } from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../data/categories';

export default function Shop() {
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  const categoryFilter = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const inStock = searchParams.get('inStock') === 'true';
  const otc = searchParams.get('otc') === 'true';
  const queryParam = searchParams.get('q');

  const { products: allProducts, isLoading } = useProducts();

  useEffect(() => {
    if (window.location.hash === '#categories') {
      const el = document.getElementById('categories');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (categoryFilter) {
      const catLower = categoryFilter.toLowerCase().trim();
      result = result.filter(p => p.category?.toLowerCase().trim() === catLower);
    }

    // Price filter
    if (minPrice) {
      result = result.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => Number(p.price) <= Number(maxPrice));
    }

    // Availability
    if (inStock) {
      result = result.filter(p => Number(p.stock_quantity) > 0);
    }
    
    // OTC
    if (otc) {
      result = result.filter(p => !p.prescription_required);
    }

    // Search filter
    const activeSearchQuery = searchQuery || queryParam || '';
    if (activeSearchQuery.trim()) {
      const q = activeSearchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.generic_name && p.generic_name.toLowerCase().includes(q)) ||
        (p.genericName && p.genericName.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || b.createdAt || 0).getTime() - new Date(a.created_at || a.createdAt || 0).getTime());
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    return result;
  }, [allProducts, searchQuery, queryParam, sortBy, categoryFilter, minPrice, maxPrice, inStock, otc]);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop All Products</h1>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Filter size={18} />
              Filters
            </button>
            
            {/* Search within Shop */}
            <div className="relative w-full sm:w-96">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, medicines..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              />
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-sm text-gray-500 whitespace-nowrap flex items-center gap-2">
                <SlidersHorizontal size={16} /> Sort by:
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-transparent border-none text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            
          </div>
        </div>

        {/* Categories Section in Shop */}
        <div id="categories" className="mb-8 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Shop by Category</h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {categoryFilter ? (
                  <span>Filtering by: <span className="font-semibold text-primary-700">{categoryFilter}</span></span>
                ) : (
                  'Browse all medicine & healthcare categories'
                )}
              </p>
            </div>
            {categoryFilter && (
              <button
                onClick={() => {
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                }}
                className="self-start sm:self-auto text-xs font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
              >
                Clear Category Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <button
              onClick={() => {
                if (categoryFilter) {
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                !categoryFilter
                  ? 'bg-primary-700 text-white shadow-sm shadow-primary-700/20 font-semibold'
                  : 'bg-slate-50 text-gray-700 hover:bg-slate-100 border border-gray-100'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => {
              const isActive = categoryFilter?.toLowerCase().trim() === cat.toLowerCase().trim();
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (isActive) {
                      searchParams.delete('category');
                    } else {
                      searchParams.set('category', cat);
                    }
                    setSearchParams(searchParams);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-700 text-white shadow-sm shadow-primary-700/20 font-semibold'
                      : 'bg-slate-50 text-gray-700 hover:bg-slate-100 border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters />
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
                onClick={() => setShowMobileFilters(false)} 
              />
              <div className="relative w-full max-w-xs bg-white h-full overflow-y-auto">
                <ProductFilters 
                  className="rounded-none border-0 shadow-none min-h-full" 
                  onClose={() => setShowMobileFilters(false)} 
                />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                <span className="ml-3 text-slate-500 font-medium">Loading products...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <PackageOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No products found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {searchQuery ? `We couldn't find any products matching "${searchQuery}". Try different keywords.` : 'No active inventory available at this moment.'}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-xl hover:bg-primary-100"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {/* Results count info */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="mt-8 text-center text-xs text-slate-400">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
