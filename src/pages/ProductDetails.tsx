import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, ShoppingCart, Heart, Share2, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, calculateDiscount } from '../utils/format';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/productService';
import NotFound from './NotFound';

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!slug) return;
        const item = await productService.getProductBySlug(slug);
        setProduct(item);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!product) {
    return <NotFound />;
  }

  const discount = calculateDiscount(product.price, product.previous_price);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary-700">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-700">Shop</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Image Gallery */}
            <div className="p-8 md:p-12 md:border-r border-gray-100 flex items-center justify-center bg-gray-50/50 relative">
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
                {product.prescription_required && <Badge variant="warning">Prescription Required</Badge>}
              </div>
              <img 
                src={product.image_url || "https://placehold.co/400x400?text=Product"} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full max-w-md object-contain mix-blend-multiply"
              />
            </div>

            {/* Product Info */}
            <div className="p-8 md:p-12 flex flex-col">
              <div className="mb-2">
                <span className="text-sm text-primary-700 font-bold tracking-wider uppercase">{product.brand}</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="text-gray-600 mb-4">
                {product.generic_name && <span>{product.generic_name}</span>}
                {product.strength && <span> • {product.strength}</span>}
                {product.packSize && <span> • {product.packSize}</span>}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-accent-mustard">
                  <Star size={18} className="fill-current" />
                  <span className="ml-1 text-gray-700 font-medium">{product.rating}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <span className="text-sm text-gray-500 hover:text-primary-600 cursor-pointer">
                  See Reviews
                </span>
              </div>

              <div className="mb-8">
                {product.previous_price && product.previous_price > product.price && (
                  <div className="text-gray-400 line-through text-lg">
                    {formatCurrency(product.previous_price)}
                  </div>
                )}
                <div className="text-3xl font-bold text-primary-800">
                  {formatCurrency(product.price)}
                </div>
              </div>

              {/* Status and Prescription Warning */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock_quantity} available)`}
                  </span>
                </div>

                {product.prescription_required && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                    <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-yellow-800">Prescription Required</h4>
                      <p className="text-xs text-yellow-700 mt-1">
                        You must upload a valid prescription during checkout. Our pharmacist will review it before processing your order.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart Actions */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-200 rounded-lg h-12 w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-full text-center border-none focus:ring-0 text-gray-900 font-medium p-0"
                    min="1"
                    max={product.stock_quantity}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary-700 transition-colors"
                  >
                    +
                  </button>
                </div>

                <Button 
                  size="lg" 
                  className="flex-grow flex items-center gap-2"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-6 border-t border-gray-100 pt-6">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent-orange font-medium transition-colors">
                  <Heart size={18} />
                  Add to Wishlist
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors">
                  <Share2 size={18} />
                  Share Product
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-auto pt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck size={18} className="text-primary-600" />
                  100% Genuine Healthcare Products
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck size={18} className="text-primary-600" />
                  Fast & Secure Nationwide Delivery
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {['description', 'composition', 'directions', 'warnings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 md:px-8 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-primary-600 text-primary-700' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="p-8">
            <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Product Description</h3>
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === 'composition' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Ingredients & Composition</h3>
                  <p>{product.composition || 'Information not available. Please check the product packaging.'}</p>
                </div>
              )}
              {activeTab === 'directions' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Directions for Use</h3>
                  <p>{product.directions || 'Follow the instructions on the product packaging or as directed by your physician or pharmacist.'}</p>
                </div>
              )}
              {activeTab === 'warnings' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Safety Warnings & Storage</h3>
                  <div className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-4">
                    <p className="font-medium text-gray-900 m-0 flex items-center gap-2">
                      <Info size={18} className="text-gray-500" />
                      Important Notice
                    </p>
                    <p className="text-sm mt-2">Always read the label. Use only as directed. If symptoms persist, see your healthcare professional.</p>
                  </div>
                  <p>{product.warnings || 'Keep out of reach of children.'}</p>
                  <h4 className="font-bold text-gray-900 mt-6 mb-2">Storage</h4>
                  <p>{product.storage || 'Store in a cool, dry place below 30°C. Protect from direct sunlight.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
