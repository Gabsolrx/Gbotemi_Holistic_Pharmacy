import fs from 'fs';
let code = fs.readFileSync('src/pages/PrescriptionUpload.tsx', 'utf8');

if (!code.includes('uploadProductImage')) {
  console.log("Error: uploadProductImage not found in code");
}

if (!code.includes("import { uploadProductImage }")) {
  code = code.replace(
    "import toast from 'react-hot-toast';", 
    "import toast from 'react-hot-toast';\nimport { uploadProductImage } from '../utils/imageUpload';"
  );
  fs.writeFileSync('src/pages/PrescriptionUpload.tsx', code);
  console.log("Patched import");
} else {
  console.log("Import already exists");
}
