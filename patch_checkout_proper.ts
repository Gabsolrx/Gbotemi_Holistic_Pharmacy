import fs from 'fs';
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

// First remove the old logic
code = code.replace(
`  // Protect route
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate('/cart');
    }
  }, [items.length, isProcessing, navigate]);

  if (items.length === 0 && !isProcessing) {
    return null;
  }`,
`  // Protect route
  useEffect(() => {
    // Only redirect if cart is empty and we haven't successfully processed an order
    if (items.length === 0 && !isProcessing && !sessionStorage.getItem('orderSuccess')) {
      navigate('/cart');
    }
  }, [items.length, isProcessing, navigate]);

  if (items.length === 0 && !isProcessing && !sessionStorage.getItem('orderSuccess')) {
    return null;
  }`
);

// Then in processPayment, set the sessionStorage flag
code = code.replace(
`      // 3. Clear cart and redirect
      toast.success('Payment completed securely');
      clearCart();
      navigate('/checkout/success', { state: { orderId: orderData.id } });`,
`      // 3. Clear cart and redirect
      toast.success('Payment completed securely');
      sessionStorage.setItem('orderSuccess', 'true');
      clearCart();
      navigate('/checkout/success', { state: { orderId: orderData.id } });
      // Clean up flag after a delay
      setTimeout(() => sessionStorage.removeItem('orderSuccess'), 1000);`
);

fs.writeFileSync('src/pages/Checkout.tsx', code);
console.log('Patched Checkout.tsx');
