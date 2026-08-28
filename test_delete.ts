import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Orders.tsx', 'utf8');
code = code.replace(
  "toast.error('Failed to delete order');",
  "console.error('Delete error:', err);\n      toast.error('Failed to delete order');"
);
fs.writeFileSync('src/pages/admin/Orders.tsx', code);
