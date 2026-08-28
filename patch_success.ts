import fs from 'fs';
let code = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const target1 = `Prescription Submitted!`;
const replace1 = `Redirecting to WhatsApp...`;

const target2 = `Our pharmacists will review your prescription and contact you shortly with the cost and delivery details.`;
const replace2 = `We've opened a new tab to continue your prescription order via WhatsApp. If it didn't open automatically, please ensure pop-ups are allowed.`;

code = code.replace(target1, replace1);
code = code.replace(target2, replace2);

fs.writeFileSync('src/pages/PrescriptionUpload.tsx', code);
console.log('Successfully patched success message');
