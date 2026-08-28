const fs = require('fs');
let content = fs.readFileSync('src/services/productService.ts', 'utf-8');

content = content.replace(/await await saveToLocalStorage/g, 'await saveToLocalStorage');
content = content.replace(/async function await saveToLocalStorage/g, 'async function saveToLocalStorage');

fs.writeFileSync('src/services/productService.ts', content);
