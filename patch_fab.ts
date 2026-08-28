import fs from 'fs';
let code = fs.readFileSync('src/components/ui/WhatsAppFAB.tsx', 'utf8');

code = code.replace(
  "const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153';",
  `let whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153';
  whatsappNumber = whatsappNumber.replace(/[\\s+-]/g, '');
  if (whatsappNumber.startsWith('0')) {
    whatsappNumber = '234' + whatsappNumber.substring(1);
  }`
);

fs.writeFileSync('src/components/ui/WhatsAppFAB.tsx', code);
console.log('Patched WhatsAppFAB.tsx');
