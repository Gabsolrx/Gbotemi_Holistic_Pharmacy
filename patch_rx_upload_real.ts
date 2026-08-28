import fs from 'fs';
let code = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

const target = `    try {
      // Create a dummy URL for the file to prevent the admin dashboard from crashing
      const fileUrl = 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80';`;

const replace = `    try {
      let fileUrl = '';
      if (file) {
        const uploadResult = await uploadProductImage(file);
        fileUrl = uploadResult.url;
      }`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  // Add import
  if (!code.includes('uploadProductImage')) {
    code = "import { uploadProductImage } from '../utils/imageUpload';\n" + code;
  }
  fs.writeFileSync('src/pages/PrescriptionUpload.tsx', code);
  console.log('Upload now uses actual image!');
} else {
  console.log('Target not found!');
}
