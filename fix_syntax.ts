import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Consultations.tsx', 'utf8');

code = code.replace("c.(type || '').toLowerCase()", "(c.type || '').toLowerCase()");

fs.writeFileSync('src/pages/admin/Consultations.tsx', code);
console.log('Fixed syntax error.');
