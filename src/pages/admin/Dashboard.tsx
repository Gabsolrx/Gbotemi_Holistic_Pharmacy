import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/format';
import { productService } from '../../services/productService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '../../lib/supabase';

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const productData = [
  { name: 'Paracetamol', sales: 400 },
  { name: 'Vitamin C', sales: 300 },
  { name: 'Blood Pressure Monitor', sales: 200 },
  { name: 'Arthrotec 75', sales: 278 },
];

export default function AdminDashboard() {
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await productService.getProducts();
        setLiveProducts(items || []);

        const { data: ords } = await supabase.from('orders').select('*');
        if (ords) setOrders(ords);
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
    window.addEventListener('products-updated', loadData);
    return () => {
      window.removeEventListener('products-updated', loadData);
    };
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  
  const lowStockProducts = liveProducts.filter(
    (product) => product.stockQuantity <= (product.lowStockThreshold || 10)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Operational metrics and activity at Gbotemi Holistic Pharmacy.</p>
      </div>
      
      {/* Metric Cards (No Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md">
              Finance
            </span>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md">
              +12% vs last wk
            </span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              Orders
            </span>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md">
              +8% active
            </span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Total Orders</h3>
            <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              Inventory
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Live Stock
            </span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Active Products</h3>
            <p className="text-2xl font-bold text-slate-900">{liveProducts.filter(p => p.active).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              Queue
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">Pending Orders</h3>
            <p className="text-2xl font-bold text-slate-900">{pendingOrders.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Revenue Overview</h2>
              <p className="text-sm text-slate-500">Weekly revenue performance</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047857" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `₦${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`₦${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#047857" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Top Selling Products</h2>
              <p className="text-sm text-slate-500">Highest performing items this week</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, width: 100 }} width={120} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="sales" fill="#047857" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Action Center (No Icons) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Action Required</h2>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-4 hover:bg-slate-50 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Pending Order Review
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Pending Orders ({pendingOrders.length})</h4>
                <p className="text-xs text-slate-500 mt-1">Customer orders waiting to be confirmed, packaged, and dispatched.</p>
              </div>
              <div className="p-4 hover:bg-slate-50 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  Prescriptions
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Rx Upload Queue</h4>
                <p className="text-xs text-slate-500 mt-1">Patient uploaded prescriptions requiring licensed pharmacist review.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-80">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">
                Low Stock Alerts
              </h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{lowStockProducts.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {lowStockProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
                  <p className="text-sm font-medium">All product inventory levels are optimal.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {lowStockProducts.map(product => (
                    <div key={product.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm truncate max-w-[150px]">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-600">{product.stockQuantity} left</p>
                        <p className="text-xs text-slate-400">Restock soon</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
