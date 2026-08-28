const fs = require('fs');

let content = fs.readFileSync('src/services/productService.ts', 'utf-8');

// 1. Add idb-keyval import
if (!content.includes('idb-keyval')) {
  content = `import { get as idbGet, set as idbSet } from 'idb-keyval';\n` + content;
}

// 2. Rewrite getLocalStoredProducts and saveToLocalStorage
const oldGet = `function getLocalStoredProducts(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch (err) {
    console.warn('Error reading products from localStorage:', err);
  }

  // Seed default products
  const initial = mockProducts.map(normalizeProduct);
  saveToLocalStorage(initial);
  return initial;
}`;

const newGet = `async function getLocalStoredProducts(): Promise<any[]> {
  try {
    let parsed: any = await idbGet(STORAGE_KEY);
    
    // Migration from localStorage if idb is empty
    if (!parsed) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        parsed = JSON.parse(raw);
        // Clean up old localStorage to free up the quota!
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(normalizeProduct);
    }
  } catch (err) {
    console.warn('Error reading products from storage:', err);
  }

  // Seed default products
  const initial = mockProducts.map(normalizeProduct);
  await saveToLocalStorage(initial);
  return initial;
}`;
content = content.replace(oldGet, newGet);

const oldSave = `function saveToLocalStorage(products: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err: any) {
    console.error('Error saving products to localStorage. It may be full:', err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('inventory-error', { detail: err.message }));
    }
  }
}`;

const newSave = `async function saveToLocalStorage(products: any[]) {
  try {
    await idbSet(STORAGE_KEY, products);
  } catch (err: any) {
    console.error('Error saving products to IndexedDB:', err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('inventory-error', { detail: err.message }));
    }
  }
}`;
content = content.replace(oldSave, newSave);

// 3. Replace synchronous calls with await
content = content.replace(/const localList = getLocalStoredProducts\(\);/g, 'const localList = await getLocalStoredProducts();');
content = content.replace(/list = getLocalStoredProducts\(\);/g, 'list = await getLocalStoredProducts();');
content = content.replace(/const local = getLocalStoredProducts\(\);/g, 'const local = await getLocalStoredProducts();');
content = content.replace(/const existingList = getLocalStoredProducts\(\);/g, 'const existingList = await getLocalStoredProducts();');
content = content.replace(/const list = getLocalStoredProducts\(\);/g, 'const list = await getLocalStoredProducts();');

content = content.replace(/saveToLocalStorage\(/g, 'await saveToLocalStorage(');

// Also fix the seeded call inside getLocalStoredProducts that we just modified
// We already did `await saveToLocalStorage(initial);` in the replacement so we are good there.

fs.writeFileSync('src/services/productService.ts', content);
