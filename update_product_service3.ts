import fs from 'fs';
let content = fs.readFileSync('src/services/productService.ts', 'utf8');

content = content.replace(
  "        if (p.imageUrl && p.imageUrl.startsWith('data:image/')) return true;\n        if (p.image_url && p.image_url.startsWith('data:image/')) return true;",
  "        if (p.imageUrl && (p.imageUrl.startsWith('data:image/') || p.imageUrl.includes('supabase.co/storage'))) return true;\n        if (p.image_url && (p.image_url.startsWith('data:image/') || p.image_url.includes('supabase.co/storage'))) return true;"
);
fs.writeFileSync('src/services/productService.ts', content);
