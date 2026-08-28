import fs from 'fs';

let content = fs.readFileSync('src/services/productService.ts', 'utf8');

const cleanupCode = `
    if (Array.isArray(parsed) && parsed.length > 0) {
      // CLEANUP: Remove mock products and duplicates from local storage
      const mockNames = new Set(mockProducts.map(m => m.name));
      let filtered = parsed.filter(p => {
        // Keep if it's NOT a mock product name
        if (!mockNames.has(p.name)) return true;
        // If it IS a mock product name, keep it ONLY if the user uploaded a custom image for it
        if (p.imageUrl && p.imageUrl.startsWith('data:image/')) return true;
        if (p.image_url && p.image_url.startsWith('data:image/')) return true;
        return false;
      });
      
      // Deduplicate by name (keep latest/UUID version)
      const uniqueMap = new Map();
      filtered.forEach(p => {
        const existing = uniqueMap.get(p.name);
        if (!existing || (isValidUUID(p.id) && !isValidUUID(existing.id))) {
           uniqueMap.set(p.name, p);
        }
      });
      filtered = Array.from(uniqueMap.values());
      
      return filtered.map(normalizeProduct);
    }
`;

content = content.replace(
  "    if (Array.isArray(parsed) && parsed.length > 0) {\n      return parsed.map(normalizeProduct);\n    }",
  cleanupCode
);

content = content.replace(
  "  // Seed default products\n  const initial = mockProducts.map(normalizeProduct);\n  await saveToLocalStorage(initial);\n  return initial;",
  "  return [];"
);

fs.writeFileSync('src/services/productService.ts', content);
