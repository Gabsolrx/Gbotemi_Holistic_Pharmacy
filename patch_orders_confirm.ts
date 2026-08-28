import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Orders.tsx', 'utf8');

// Add a state for orderToDelete
if (!code.includes("const [orderToDelete, setOrderToDelete]")) {
  code = code.replace(
    "const [selectedOrder, setSelectedOrder] = useState<any | null>(null);",
    "const [selectedOrder, setSelectedOrder] = useState<any | null>(null);\n  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);"
  );
}

// Modify handleDeleteOrder
code = code.replace(
  `  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      // Delete order_items first due to foreign key constraints
      const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', orderId);
      if (itemsError) throw itemsError;
      
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete order');
    }
  };`,
  `  const handleDeleteOrder = async (orderId: string) => {
    try {
      // Delete order_items first due to foreign key constraints
      const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', orderId);
      if (itemsError) throw itemsError;
      
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete order');
    }
    setOrderToDelete(null);
  };`
);

// update the button onClick
code = code.replace(
  "onClick={() => handleDeleteOrder(order.id)}",
  "onClick={() => setOrderToDelete(order.id)}"
);

// Add the modal to the render
code = code.replace(
  "{selectedOrder && (",
  `{orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Order</h3>
            <p className="text-slate-500 mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteOrder(orderToDelete)}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {selectedOrder && (`
);

fs.writeFileSync('src/pages/admin/Orders.tsx', code);
console.log('Patched Orders confirmation modal');
