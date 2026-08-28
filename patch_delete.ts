import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Orders.tsx', 'utf8');

const target = `  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete order');
    }
  };`;

const replacement = `  const handleDeleteOrder = async (orderId: string) => {
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
  };`;

code = code.replace(target, replacement);

fs.writeFileSync('src/pages/admin/Orders.tsx', code);
console.log('Patched Orders.tsx');
