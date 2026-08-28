import fs from 'fs';
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

code = code.replace(
  "const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'pickup'>('standard');",
  "const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'pickup' | null>(null);"
);

code = code.replace(
  "    } else if (currentStep === 3) {\n      isValid = true;\n    }",
  "    } else if (currentStep === 3) {\n      isValid = !!deliveryMethod;\n      if (!isValid) toast.error('Please select a shipping method');\n    }"
);

code = code.replace(
  `                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
                </div>`,
  `                {deliveryMethod && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
                  </div>
                )}`
);

fs.writeFileSync('src/pages/Checkout.tsx', code);
console.log('Patched Checkout.tsx');
