import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../utils/format';

export default function AccountDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching dashboard orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecentOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600 mb-8">
          Here is an overview of your recent activity and orders.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="border border-gray-100 rounded-xl p-6 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
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
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500 text-sm">Loading recent orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
            <ShoppingBag className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="mb-4">You haven't placed any orders yet.</p>
            <Link to="/shop">
              <Button variant="outline">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const itemCount = order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
              return (
                <div key={order.id} className="border border-gray-200 rounded-xl p-4 bg-white hover:border-primary-200 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-mono text-gray-500 mr-2">Order #{order.id.substring(0, 8).toUpperCase()}</span>
                      <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`${getStatusColor(order.status)} px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Product Names */}
                  <div className="py-1 space-y-1">
                    {order.order_items?.map((item: any, idx: number) => (
                      <div key={item.id || idx} className="text-xs font-medium text-slate-900 flex justify-between">
                        <span>• {item.product_name || 'Prescription Product'} (Qty: {item.quantity})</span>
                        <span className="text-slate-600">{formatCurrency((item.price_at_time || 0) * (item.quantity || 1))}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-100 text-xs">
                    <span className="text-gray-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                    <span className="font-bold text-primary-800 text-sm">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
