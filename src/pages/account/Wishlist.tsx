import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <Heart size={48} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Your wishlist is empty</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        You haven't saved any items to your wishlist yet. Browse our products and tap the heart icon to save your favorites for later!
      </p>
      <Button 
        size="lg" 
        onClick={() => navigate('/shop')}
        className="gap-2"
      >
        <ShoppingBag size={18} />
        Start Shopping
      </Button>
    </div>
  );
}
