const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/services/productService.ts', 'utf-8');

const oldSave = `// Save products to localStorage
function saveToLocalStorage(products: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.warn('Error saving products to localStorage:', err);
  }
}`;

const newSave = `// Save products to localStorage
function saveToLocalStorage(products: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err: any) {
    console.error('Error saving products to localStorage. It may be full:', err);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('inventory-error', { detail: err.message }));
    }
  }
}`;

content = content.replace(oldSave, newSave);
fs.writeFileSync('/app/applet/src/services/productService.ts', content);
