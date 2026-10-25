import { useState, useEffect } from 'react';
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

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.order_items?.some((item: any) => item.product_name?.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500 font-sans">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 font-sans">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">
            Empty Order History
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="mb-6 max-w-sm mx-auto text-sm">When you place an order, it will appear here so you can track its status.</p>
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <div className="w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search by order or product..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
           <div className="text-center py-12 text-gray-500">No orders match your search.</div>
        ) : (
          filteredOrders.map(order => {
            const itemCount = order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
            return (
              <div key={order.id} className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="text-sm font-mono text-gray-500 mb-1">Order #{order.id.substring(0, 8).toUpperCase()}</div>
                    <div className="text-sm font-medium text-gray-900">Placed on {new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                    {order.status}
                  </div>
                </div>

                {/* Ordered Products Section */}
                <div className="my-4 bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Products Ordered:
                  </div>
                  {order.order_items && order.order_items.length > 0 ? (
                    <div className="divide-y divide-slate-200/60">
                      {order.order_items.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-sm">
                          <div className="font-semibold text-slate-900">
                            <span>{item.product_name || 'Prescription Product'}</span>
                            <span className="text-xs font-medium text-slate-500 ml-2">Qty: {item.quantity}</span>
                          </div>
                          <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
                            {formatCurrency((item.price_at_time || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic">Product details listed upon verification.</div>
                  )}
                </div>
                
                {/* Uploaded Receipt Document */}
                {(() => {
                  let receiptUrl = order.receipt_url;
                  if (!receiptUrl && order.payment_reference && order.payment_reference.includes('http')) {
                    const parts = order.payment_reference.split('|');
                    const found = parts.find((p: string) => p.trim().startsWith('http'));
                    if (found) receiptUrl = found.trim();
                  }
                  if (!receiptUrl) {
                    try {
                      const cache = JSON.parse(localStorage.getItem('gbotemi_order_receipts') || '{}');
                      receiptUrl = cache[order.id];
                    } catch {}
                  }

                  if (!receiptUrl) return null;

                  return (
                    <div className="my-2 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-900">
                        Uploaded Bank Receipt:
                      </span>
                      <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-primary-700 hover:text-primary-800 hover:underline bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-2xs touch-manipulation"
                      >
                        View Receipt Document
                      </a>
                    </div>
                  );
                })()}

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    Total ({itemCount} item{itemCount !== 1 ? 's' : ''})
                  </span>
                  
                  <span className="text-base sm:text-lg font-extrabold text-primary-800">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
