const fs = require('fs');

let header = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

header = header.replace(
  "import { Link, useLocation } from 'react-router-dom';",
  "import { Link, useLocation, useNavigate } from 'react-router-dom';"
);

const searchLogic = `
export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(\`/shop?q=\${encodeURIComponent(searchQuery.trim())}\`);
    }
  };
`;

header = header.replace("export default function Header() {", searchLogic);

fs.writeFileSync('src/components/layout/Header.tsx', header);
