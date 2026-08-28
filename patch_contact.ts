import fs from 'fs';
let code = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
code = code.replace(
  "href={`tel:\${import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153'}`}",
  "href={`tel:\${(import.meta.env.VITE_WHATSAPP_NUMBER || '2348029660153').replace(/[\\s+-]/g, '').replace(/^0/, '234')}`}"
);
fs.writeFileSync('src/pages/Contact.tsx', code);
