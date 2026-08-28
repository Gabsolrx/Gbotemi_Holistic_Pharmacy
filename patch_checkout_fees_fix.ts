import fs from 'fs';
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

code = code.replace(
  "setStandardFee(config.storeSettings.deliveryFeeStandard);",
  "setStandardFee(Number(config.storeSettings.deliveryFeeStandard) || 0);"
);

code = code.replace(
  "setExpressFee(config.storeSettings.deliveryFeeExpress);",
  "setExpressFee(Number(config.storeSettings.deliveryFeeExpress) || 0);"
);

fs.writeFileSync('src/pages/Checkout.tsx', code);
console.log('Patched Checkout logic.');
