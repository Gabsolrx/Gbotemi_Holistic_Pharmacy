import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/CMS.tsx', 'utf8');

code = code.replace(
  "else if (type === 'number') parsedValue = Number(value);",
  "else if (type === 'number') parsedValue = value === '' ? '' : Number(value);"
);

// We should also replace the default values in the render so that it doesn't default to 1500 if the value is empty string. Actually if it's empty string, ?? 1500 won't trigger because it's not null/undefined.
// Let's change `value={config.storeSettings.deliveryFeeStandard ?? 1500}` to `value={config.storeSettings.deliveryFeeStandard !== undefined ? config.storeSettings.deliveryFeeStandard : 1500}`
// Wait, `??` does exactly that. `"" ?? 1500` is `""`.

fs.writeFileSync('src/pages/admin/CMS.tsx', code);
console.log('Patched CMS.tsx');
