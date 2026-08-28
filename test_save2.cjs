const fs = require('fs');

const content = fs.readFileSync('./src/data/mockProducts.ts', 'utf-8');
const match = content.match(/\[[\s\S]*\]/);
let existingList = JSON.parse(match[0]);

// Simulate getLocalStoredProducts
function normalizeProduct(item) {
  const id = String(item.id || item.productId || 'fallback');
  const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0;
  return { ...item, id, price };
}
existingList = existingList.map(normalizeProduct);

// Simulate what ProductFormModal does
const productToEdit = existingList.find(p => p.id === "13"); // Losartan
const formData = {
  name: productToEdit.name + " EDITED",
  slug: productToEdit.slug,
  brand: productToEdit.brand,
  generic_name: productToEdit.generic_name,
  description: productToEdit.description,
  price: 9999,
  previous_price: productToEdit.previous_price,
  stock_quantity: productToEdit.stock_quantity,
  low_stock_threshold: productToEdit.low_stock_threshold,
  prescription_required: productToEdit.prescription_required,
  active: productToEdit.active,
  featured: productToEdit.featured,
  image_url: productToEdit.image_url,
  category: productToEdit.category
};

const payload = {
  ...formData,
  id: productToEdit.id,
  price: Number(formData.price),
};

// Simulate saveProduct
const isEdit = Boolean(payload.id);
const productId = String(payload.id);
const fullProduct = normalizeProduct({ ...payload, id: productId });

let updatedList;
if (isEdit) {
  updatedList = existingList.map(p => (p.id === productId ? fullProduct : p));
}

const losartanAfter = updatedList.find(p => p.id === "13");
console.log("Before:", productToEdit.name, productToEdit.price);
console.log("After:", losartanAfter.name, losartanAfter.price);
