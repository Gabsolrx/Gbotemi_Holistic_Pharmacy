const fs = require('fs');
const content = fs.readFileSync('./src/data/mockProducts.ts', 'utf-8');
const jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
const products = JSON.parse(jsonStr);

function normalizeProduct(item) {
  const id = String(item.id || item.productId || 'fallback');
  return { ...item, id };
}

const existingList = products.map(normalizeProduct);
const formData = { id: "13", name: "Losartan 50mg EDITED" };
const isEdit = Boolean(formData.id);
const productId = String(formData.id);
const fullProduct = { ...formData, id: productId };

let updatedList;
if (isEdit) {
  updatedList = existingList.map(p => (p.id === productId ? fullProduct : p));
} else {
  updatedList = [fullProduct, ...existingList];
}

const losartanAfter = updatedList.find(p => p.id === "13");
console.log(losartanAfter.name);
