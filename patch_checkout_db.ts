import fs from 'fs';

let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

const oldProcessPayment = `      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user?.id || null, // Allow guest checkout if RLS permits, or require login. Actually schema says customer_id is nullable.
          total_amount: subtotal + deliveryFee,
          delivery_fee: deliveryFee,
          delivery_method: deliveryMethod === 'standard' ? 'Standard Delivery' : 'Express Delivery',
          delivery_address: {
             firstName: data.firstName,
             lastName: data.lastName,
             email: data.email,
             phone: data.phone,
             state: data.state,
             city: data.city,
             address: data.address,
             landmark: data.landmark
          },
          status: 'Order Received',
          payment_status: 'paid', // Assuming payment is processed securely
          paystack_reference: 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        })
        .select()
        .single();

      if (orderError) throw orderError;
      
      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price
      }));`;

const newProcessPayment = `      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null, 
          customer_name: data.firstName + ' ' + data.lastName,
          customer_email: data.email,
          shipping_address: data.address + ', ' + data.city + ', ' + data.state,
          total_amount: subtotal + deliveryFee,
          status: 'pending',
          payment_reference: 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        })
        .select()
        .single();

      if (orderError) throw orderError;
      
      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price_at_time: item.product.price
      }));`;

code = code.replace(oldProcessPayment, newProcessPayment);

fs.writeFileSync('src/pages/Checkout.tsx', code);
console.log('Patched Checkout.tsx with correct columns');
