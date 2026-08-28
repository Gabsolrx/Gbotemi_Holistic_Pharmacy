import fs from 'fs';
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

code = code.replace(
  '<span className="text-sm font-bold text-gray-900">₦1,500</span>',
  '<span className="text-sm font-bold text-gray-900">{formatCurrency(standardFee)}</span>'
);

code = code.replace(
  '<span className="text-sm font-bold text-gray-900">₦3,000</span>',
  '<span className="text-sm font-bold text-gray-900">{formatCurrency(expressFee)}</span>'
);

fs.writeFileSync('src/pages/Checkout.tsx', code);
console.log('Patched Checkout UI.');
