import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Eye } from 'lucide-react';
import { Product } from '../../../types';
import { useCart } from '../../../hooks/useCart';

interface FeaturedProductCardProps {
  product: Product;
  className?: string;
}

export function FeaturedProductCard({ product, className = '' }: FeaturedProductCardProps) {
  const { addItem, items } = useCart();
  const isInCart = items.some((item) => item.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const isPrescription = product.prescriptionRequired || (product as any).prescription_required;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-3.5 sm:p-4 border border-emerald-900/10 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      {/* Product Image & Badges */}
      <div className="relative w-full aspect-square bg-[#FAF8F0] rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Prescription or In-Stock Status */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {isPrescription ? (
            <span className="text-[10px] font-semibold tracking-wide bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs">
              Rx Required
            </span>
          ) : (
            <span className="text-[10px] font-medium tracking-wide bg-[#DDF5E8] text-[#064E3B] px-2 py-0.5 rounded-md border border-[#087F5B]/20 shadow-2xs">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Link Overlay */}
        <Link
          to={`/products/${product.slug}`}
          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 text-[#17231E] hover:bg-[#087F5B] hover:text-white shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          aria-label={`View details for ${product.name}`}
        >
          <Eye size={14} />
        </Link>
      </div>

      {/* Details */}
      <div>
        <span className="text-[10px] uppercase font-semibold text-[#65776D] tracking-wider block truncate">
          {product.category || 'Healthcare'}
        </span>

        <Link
          to={`/products/${product.slug}`}
          className="text-xs sm:text-sm font-bold text-[#17231E] group-hover:text-[#087F5B] transition-colors line-clamp-1 mt-0.5 block"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-gray-100">
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-[#087F5B]">
              ₦{product.price.toLocaleString()}
            </span>
            {product.previousPrice && (
              <span className="text-[10px] text-gray-400 line-through ml-1.5">
                ₦{product.previousPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
              isInCart
                ? 'bg-[#064E3B] text-white shadow-2xs'
                : 'bg-[#DDF5E8] text-[#087F5B] hover:bg-[#087F5B] hover:text-white'
            }`}
            title="Add to shopping cart"
          >
            {isInCart ? (
              <>
                <Check size={13} />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <Plus size={13} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
