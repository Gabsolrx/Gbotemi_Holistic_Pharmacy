import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Consultations.tsx', 'utf8');

code = code.replace(/status\?\.toLowerCase\(\)/g, "(status || '').toLowerCase()");
code = code.replace(/type\?\.toLowerCase\(\)/g, "(type || '').toLowerCase()");
code = code.replace(/c\.id\?\.toLowerCase\(\)/g, "(c.id || '').toLowerCase()");
code = code.replace(/c\.reason\?\.toLowerCase\(\)/g, "(c.reason || '').toLowerCase()");
code = code.replace(/c\.type\?\.toLowerCase\(\)/g, "(c.type || '').toLowerCase()");
code = code.replace(/searchTerm\.toLowerCase\(\)/g, "(searchTerm || '').toLowerCase()");

fs.writeFileSync('src/pages/admin/Consultations.tsx', code);
console.log('Robust patch applied.');
