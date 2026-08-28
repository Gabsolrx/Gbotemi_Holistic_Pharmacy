const fs = require('fs');

let shopContent = fs.readFileSync('src/pages/Shop.tsx', 'utf8');

// We will modify the filteredProducts memo in Shop.tsx to also read minPrice, maxPrice, inStock, otc from searchParams
const filterLogic = `
  const categoryFilter = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const inStock = searchParams.get('inStock') === 'true';
  const otc = searchParams.get('otc') === 'true';
  const queryParam = searchParams.get('q');
  
  // Initialize searchQuery from URL if it's empty
  if (queryParam && !searchQuery) {
    setSearchQuery(queryParam);
  }

  const { products: allProducts, isLoading } = useProducts();

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (categoryFilter) {
      const catLower = categoryFilter.toLowerCase().trim();
      result = result.filter(p => p.category?.toLowerCase().trim() === catLower);
    }

    // Price filter
    if (minPrice) {
      result = result.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => Number(p.price) <= Number(maxPrice));
    }

    // Availability
    if (inStock) {
      result = result.filter(p => Number(p.stock_quantity) > 0);
    }
    
    // OTC
    if (otc) {
      result = result.filter(p => !p.prescription_required);
    }

    // Search filter
    const activeSearchQuery = searchQuery || queryParam || '';
    if (activeSearchQuery.trim()) {
      const q = activeSearchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.generic_name && p.generic_name.toLowerCase().includes(q)) ||
        (p.genericName && p.genericName.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
`;

shopContent = shopContent.replace(
  /const categoryFilter = searchParams\.get\('category'\);[\s\S]*?if \(searchQuery\.trim\(\)\) {[\s\S]*?\}/,
  filterLogic.trim()
);

fs.writeFileSync('src/pages/Shop.tsx', shopContent);
