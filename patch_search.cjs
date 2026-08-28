const fs = require('fs');

// Fix Header.tsx search
let header = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');
header = header.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link, useNavigate } from 'react-router-dom';\nimport { useState } from 'react';"
);

const searchBarDesktopOld = `<div className="hidden md:flex flex-grow max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search medicines, vitamins, and healthcare products..." 
              className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
            <button className="absolute right-1 top-1 bottom-1 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors flex items-center justify-center">
              <Search size={20} />
            </button>
          </div>`;
          
const searchBarMobileOld = `<div className="mt-4 md:hidden relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <button className="absolute right-0 top-0 bottom-0 px-4 text-primary-700 flex items-center justify-center">
            <Search size={20} />
          </button>
        </div>`;

const searchLogic = `
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(\`/shop?q=\${encodeURIComponent(searchQuery.trim())}\`);
    }
  };
`;

header = header.replace(
  "export function Header() {",
  "export function Header() {" + searchLogic
);

const searchBarDesktopNew = `<form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-2xl relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines, vitamins, and healthcare products..." 
              className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors flex items-center justify-center">
              <Search size={20} />
            </button>
          </form>`;
          
const searchBarMobileNew = `<form onSubmit={handleSearch} className="mt-4 md:hidden relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..." 
            className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 text-primary-700 flex items-center justify-center">
            <Search size={20} />
          </button>
        </form>`;

header = header.replace(searchBarDesktopOld, searchBarDesktopNew);
header = header.replace(searchBarMobileOld, searchBarMobileNew);

fs.writeFileSync('src/components/layout/Header.tsx', header);

// Fix Shop.tsx initialization
let shop = fs.readFileSync('src/pages/Shop.tsx', 'utf8');
shop = shop.replace(
  "const [searchQuery, setSearchQuery] = useState('');",
  "const [searchParams, setSearchParams] = useSearchParams();\n  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');"
);
shop = shop.replace("const [searchParams, setSearchParams] = useSearchParams();", "");
shop = shop.replace(
  /const queryParam = searchParams\.get\('q'\);\s*\/\/ Initialize searchQuery from URL if it's empty\s*if \(queryParam && !searchQuery\) \{\s*setSearchQuery\(queryParam\);\s*\}/,
  "const queryParam = searchParams.get('q');"
);

fs.writeFileSync('src/pages/Shop.tsx', shop);

// Fix ProductFilters.tsx
let filters = fs.readFileSync('src/components/shop/ProductFilters.tsx', 'utf8');
const filterLogic2 = `
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [otc, setOtc] = useState(searchParams.get('otc') === 'true');

  const handleCategoryChange = (category: string) => {
    if (activeCategory === category) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const applyFilters = () => {
    if (minPrice) searchParams.set('minPrice', minPrice);
    else searchParams.delete('minPrice');

    if (maxPrice) searchParams.set('maxPrice', maxPrice);
    else searchParams.delete('maxPrice');

    if (inStock) searchParams.set('inStock', 'true');
    else searchParams.delete('inStock');

    if (otc) searchParams.set('otc', 'true');
    else searchParams.delete('otc');

    setSearchParams(searchParams);
    if (onClose) onClose();
  };
`;
filters = filters.replace(
  /const \[searchParams, setSearchParams\] = useSearchParams\(\);[\s\S]*?setSearchParams\(searchParams\);\s*};/,
  filterLogic2.trim()
);

filters = filters.replace(
  /<input\s*type="number"\s*placeholder="Min"\s*className="w-full/g,
  `<input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full`
);

filters = filters.replace(
  /<input\s*type="number"\s*placeholder="Max"\s*className="w-full/g,
  `<input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full`
);

// Stock
filters = filters.replace(
  /<span className="text-sm text-gray-600 group-hover:text-gray-900">In Stock<\/span>/g,
  `<span className="text-sm text-gray-600 group-hover:text-gray-900">In Stock</span>`
);
// replace checkbox manually for In Stock
filters = filters.replace(
  /<input\s*type="checkbox"\s*className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"\s*\/>\s*<span className="text-sm text-gray-600 group-hover:text-gray-900">In Stock<\/span>/g,
  `<input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />\n              <span className="text-sm text-gray-600 group-hover:text-gray-900">In Stock</span>`
);

// OTC
filters = filters.replace(
  /<input\s*type="checkbox"\s*className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"\s*\/>\s*<span className="text-sm text-gray-600 group-hover:text-gray-900">Non-Prescription \(OTC\)<\/span>/g,
  `<input type="checkbox" checked={otc} onChange={(e) => setOtc(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />\n              <span className="text-sm text-gray-600 group-hover:text-gray-900">Non-Prescription (OTC)</span>`
);

filters = filters.replace(
  /<Button className="w-full">Apply Filters<\/Button>/,
  `<Button className="w-full" onClick={applyFilters}>Apply Filters</Button>`
);

fs.writeFileSync('src/components/shop/ProductFilters.tsx', filters);

