const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/pages/admin/Products.tsx', 'utf-8');

const oldEffect = `    window.addEventListener('products-updated', handleUpdate);
    return () => {
      window.removeEventListener('products-updated', handleUpdate);
    };`;

const newEffect = `    const handleError = (e: any) => {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Failed to save to local storage: ' + (e.detail || 'Quota Exceeded'));
      });
    };
    
    window.addEventListener('products-updated', handleUpdate);
    window.addEventListener('inventory-error', handleError);
    return () => {
      window.removeEventListener('products-updated', handleUpdate);
      window.removeEventListener('inventory-error', handleError);
    };`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('/app/applet/src/pages/admin/Products.tsx', content);
