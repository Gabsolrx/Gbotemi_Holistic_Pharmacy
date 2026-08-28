import fs from 'fs';
let code = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

code = code.replace(
`  // Protect route
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate('/cart');
    }
  }, [items.length, isProcessing, navigate]);

  if (items.length === 0 && !isProcessing) {
    return null;
  }`,
`  // Protect route
  import { useRef } from 'react'; // we'll use a ref to track if we're redirecting to success
`
);
