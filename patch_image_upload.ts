import fs from 'fs';
let code = fs.readFileSync('src/utils/imageUpload.ts', 'utf8');

const oldFunc = `export async function uploadProductImage(
  file: File
): Promise<{ url: string; isStorage: boolean; fileName: string; sizeKb: number }> {
  const sizeKb = Math.round(file.size / 1024);
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // First compress to avoid huge payloads
  const compressedDataUrl = await compressImage(file, 1200, 1200, 0.85);`;

const newFunc = `export async function uploadProductImage(
  file: File
): Promise<{ url: string; isStorage: boolean; fileName: string; sizeKb: number }> {
  const sizeKb = Math.round(file.size / 1024);
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  let compressedDataUrl = '';
  try {
    if (file.type.startsWith('image/')) {
      compressedDataUrl = await compressImage(file, 1200, 1200, 0.85);
    } else {
      // For PDFs, just read as base64 without compression
      compressedDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }
  } catch (err) {
    console.warn('Compression or reading failed:', err);
    throw err;
  }`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('src/utils/imageUpload.ts', code);
console.log('Patched uploadProductImage to support PDFs');
