import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/format';
import { Button } from '../components/ui/Button';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const total = subtotal;

  const hasPrescriptionItems = items.some(item => item.product.prescriptionRequired);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-16">
        <div className="w-24 h-24 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is waiting for something good.</h2>
        <p className="text-gray-600 mb-8 max-w-md text-center">
          Looks like you haven't added any products to your cart yet. Discover our premium healthcare essentials.
        </p>
        <Link to="/shop">
          <Button size="lg" className="gap-2">
            Continue Shopping <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({getTotalItems()} items)</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-grow space-y-4">
            {hasPrescriptionItems && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 mb-6">
                <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-yellow-800">Prescription Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    One or more items in your cart require a valid prescription. You will be asked to upload it during checkout.
                  </p>
                </div>
              </div>
            )}

            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm">
                {/* Image */}
                <Link to={`/products/${item.product.slug}`} className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 p-2 flex items-center justify-center">
                  <img src={item.product.imageUrl} alt={item.product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </Link>
                
                {/* Product Info */}
                <div className="flex-grow">
                  <Link to={`/products/${item.product.slug}`} className="text-lg font-bold text-gray-900 hover:text-primary-700 transition-colors line-clamp-2 mb-1">
                    {item.product.name}
                  </Link>
                  {(item.product.genericName || item.product.genericName) && (
                    <div className="text-sm text-gray-500 italic mb-2">
                      {item.product.genericName || item.product.genericName}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mb-2">
                    {item.product.strength} {item.product.packSize ? `• ${item.product.packSize}` : ''}
                  </div>
                  <div className="text-lg font-bold text-primary-800">
                    {formatCurrency(item.product.price)}
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg h-10 w-28">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary-700 transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={item.quantity}
                      readOnly
                      className="w-full h-full text-center border-none focus:ring-0 text-gray-900 font-medium p-0 text-sm"
                    />
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary-700 transition-colors disabled:opacity-50"
                      disabled={item.quantity >= item.product.stockQuantity}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.product.id)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-800">{formatCurrency(total)}</span>
                </div>

              </div>

              <Button size="lg" className="w-full gap-2" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight size={18} />
              </Button>

              <div className="mt-6 flex justify-center">
                <Link to="/shop" className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
