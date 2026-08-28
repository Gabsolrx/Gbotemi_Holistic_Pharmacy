import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, FileText, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function AccountDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600 mb-8">
          Here is an overview of your recent activity.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="border border-gray-100 rounded-xl p-6 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900">0</div>
            </div>
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
          </div>
          
          
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <Link to="/account/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
          <ShoppingBag className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="mb-4">You haven't placed any orders yet.</p>
          <Link to="/shop">
            <Button variant="outline">Start Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
