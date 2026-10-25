import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm min-h-[60vh] flex flex-col items-center justify-center text-center font-sans">
      <span className="inline-block px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-4">
        Saved Items
      </span>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Your wishlist is empty</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm">
        You haven't saved any items to your wishlist yet. Browse our products and tap "Save for Later" to keep your favorites handy!
      </p>
      <Button 
        size="lg" 
        onClick={() => navigate('/shop')}
        className="touch-manipulation"
      >
        Start Shopping
      </Button>
    </div>
  );
}
