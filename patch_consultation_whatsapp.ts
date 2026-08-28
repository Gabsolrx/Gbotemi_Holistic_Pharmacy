import fs from 'fs';
let code = fs.readFileSync('src/pages/Consultation.tsx', 'utf8');

code = code.replace(
  "href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153'}?text=Hello%20Gbotemi%20Holistic%20Pharmacy,%20I%20need%20immediate%20assistance.`}",
  `href={\`https://wa.me/\${(import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153').replace(/[\\s+-]/g, '').replace(/^0/, '234')}?text=Hello%20Gbotemi%20Holistic%20Pharmacy,%20I%20need%20immediate%20assistance.\`}`
);

fs.writeFileSync('src/pages/Consultation.tsx', code);
console.log('Patched Consultation.tsx');
