import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Consultations.tsx', 'utf8');

code = code.replace(
  "switch (status.toLowerCase()) {",
  "switch (status?.toLowerCase()) {"
);

code = code.replace(
  "switch (type.toLowerCase()) {",
  "switch (type?.toLowerCase()) {"
);

code = code.replace(
  "c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||",
  "c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||"
);

fs.writeFileSync('src/pages/admin/Consultations.tsx', code);
console.log('Patched Consultations.tsx');
