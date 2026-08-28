import fs from 'fs';
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

if (!code.includes("import { cmsService }")) {
  code = code.replace(
    "import { useAuth } from '../hooks/useAuth';",
    "import { useAuth } from '../hooks/useAuth';\nimport { cmsService } from '../services/cmsService';"
  );
}

// Add state for fees
code = code.replace(
  "const [isProcessing, setIsProcessing] = useState(false);",
  `const [isProcessing, setIsProcessing] = useState(false);
  const [standardFee, setStandardFee] = useState(1500);
  const [expressFee, setExpressFee] = useState(3000);

  useEffect(() => {
    const fetchFees = async () => {
      const config = await cmsService.getConfig();
      if (config.storeSettings?.deliveryFeeStandard !== undefined) {
        setStandardFee(config.storeSettings.deliveryFeeStandard);
      }
      if (config.storeSettings?.deliveryFeeExpress !== undefined) {
        setExpressFee(config.storeSettings.deliveryFeeExpress);
      }
    };
    fetchFees();
  }, []);`
);

// Update fee calculation
code = code.replace(
  "  if (deliveryMethod === 'standard') deliveryFee = 1500;\n  if (deliveryMethod === 'express') deliveryFee = 3000;",
  "  if (deliveryMethod === 'standard') deliveryFee = standardFee;\n  if (deliveryMethod === 'express') deliveryFee = expressFee;"
);

// We also need to update the UI where the fees are displayed to the user
code = code.replace(
  "const total = subtotal + deliveryFee;",
  "const total = subtotal + deliveryFee;"
);

fs.writeFileSync('src/pages/Checkout.tsx', code);
console.log('Patched Checkout.tsx');
