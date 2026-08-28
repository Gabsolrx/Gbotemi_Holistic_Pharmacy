import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { CATEGORIES } from '../../data/categories';

interface ProductFiltersProps {
  className?: string;
  onClose?: () => void;
}

export function ProductFilters({ className, onClose }: ProductFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [otc, setOtc] = useState(searchParams.get('otc') === 'true');

  const handleCategoryChange = (category: string) => {
    if (activeCategory === category) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const applyFilters = () => {
    if (minPrice) searchParams.set('minPrice', minPrice);
    else searchParams.delete('minPrice');

    if (maxPrice) searchParams.set('maxPrice', maxPrice);
    else searchParams.delete('maxPrice');

    if (inStock) searchParams.set('inStock', 'true');
    else searchParams.delete('inStock');

    if (otc) searchParams.set('otc', 'true');
    else searchParams.delete('otc');

    setSearchParams(searchParams);
    if (onClose) onClose();
  };

  return (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <Filter size={20} className="text-primary-600" />
          Filters
        </h3>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Categories */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {CATEGORIES.map((category) => (
              <label key={category} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={activeCategory === category}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
          <div className="space-y-4">
            <input 
              type="range" 
              min="0" 
              max="100000" 
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex items-center gap-4">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="text-gray-400">-</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Prescription Required */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Availability</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">In Stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={otc} onChange={(e) => setOtc(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">Non-Prescription (OTC)</span>
            </label>
          </div>
        </div>

        {/* Action */}
        <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
}
