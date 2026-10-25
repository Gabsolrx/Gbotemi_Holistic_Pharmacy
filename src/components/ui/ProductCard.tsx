import { MouseEvent, Key } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, calculateDiscount } from '../../utils/format';
import { Product } from '../../types';
import { Button } from './Button';
import { Badge } from './Badge';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: any;
  key?: Key;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const discount = calculateDiscount(product.price, product.previous_price);
  const isOutOfStock = product.stock_quantity <= 0;
  
  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWishlistClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to your wishlist!`);
  };

  const handleQuickView = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.slug}`);
  };
  
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <Badge variant="danger">-{discount}%</Badge>
        )}
        {product.prescription_required && (
          <Badge variant="warning">Rx Required</Badge>
        )}
      </div>
      
      {/* Quick Actions (Hover - only active when visible) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
        <button 
          type="button"
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
          title="Add to Wishlist"
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-accent-orange transition-colors cursor-pointer touch-manipulation"
        >
          <Heart size={16} />
        </button>
        <button 
          type="button"
          onClick={handleQuickView}
          aria-label="View product details"
          title="Quick View"
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-primary-600 transition-colors cursor-pointer touch-manipulation"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Image */}
      <Link to={`/products/${product.slug}`} className="relative aspect-square p-6 flex items-center justify-center bg-gray-50/50">
        <img 
          src={product.imageUrl || product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400'} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400';
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/products/${product.slug}`} className="hover:text-primary-700 transition-colors">
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
            {product.name}
          </h3>
        </Link>
        
        {product.generic_name && (
          <div className="text-xs text-gray-500 italic mb-2 line-clamp-1">
            {product.generic_name}
          </div>
        )}
        
        {(product.strength || product.packSize) && (
          <div className="text-xs text-gray-500 mb-3">
            {product.strength} {product.strength && product.packSize ? '•' : ''} {product.packSize}
          </div>
        )}
        
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            {product.previous_price && product.previous_price > product.price && (
              <div className="text-sm text-gray-400 line-through mb-0.5">
                {formatCurrency(product.previous_price)}
              </div>
            )}
            <div className="text-lg font-bold text-primary-800 leading-none">
              {formatCurrency(product.price)}
            </div>
          </div>
          
          <Button 
            size="icon" 
            variant={isOutOfStock ? "ghost" : "primary"}
            disabled={isOutOfStock}
            className="rounded-full w-10 h-10 flex-shrink-0"
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
