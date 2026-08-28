import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../utils/format';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
          <ShoppingBag className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="mb-6 max-w-sm mx-auto">When you place an order, it will appear here so you can track its status.</p>
          <Link to="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
           <div className="text-center py-12 text-gray-500">No orders match your search.</div>
        ) : (
          filteredOrders.map(order => {
            const itemCount = order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
            return (
              <div key={order.id} className="border border-gray-100 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Order #{order.id.substring(0, 8).toUpperCase()}</div>
                    <div className="text-sm font-medium text-gray-900">Placed on {new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">{itemCount}x</div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{itemCount} Item{itemCount !== 1 && 's'}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
