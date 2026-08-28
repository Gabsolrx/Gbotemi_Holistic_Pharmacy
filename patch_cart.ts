import fs from 'fs';
let code = fs.readFileSync('src/pages/Cart.tsx', 'utf8');

code = code.replace(
  '  const subtotal = getTotalPrice();\n  const estimatedDelivery = items.length > 0 ? 1500 : 0; // Base delivery fee placeholder\n  const total = subtotal + estimatedDelivery;',
  '  const subtotal = getTotalPrice();\n  const total = subtotal;'
);

code = code.replace(
  `                <div className="flex justify-between text-gray-600">
                  <span>Estimated Delivery</span>
                  <span className="font-medium text-gray-900">{formatCurrency(estimatedDelivery)}</span>
                </div>`,
  ''
);

code = code.replace(
  `                <p className="text-xs text-gray-500 mt-2 text-right">Taxes included where applicable</p>`,
  ''
);

fs.writeFileSync('src/pages/Cart.tsx', code);
console.log('Patched Cart.tsx');
