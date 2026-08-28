import { supabase } from '../lib/supabase';

/**
 * Compresses an image file client-side using HTML Canvas.
 * Ensures fast upload speeds, low memory footprint, and high visual quality.
 */
export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(event.target?.result as string);
        }

        // Smoother downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG or WEBP
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load the image for processing.'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the selected file.'));
    };
  });
}

/**
 * Uploads a product image from Laptop or Phone gallery:
 * 1. Tries Supabase Storage bucket ('products' or 'product-images').
 * 2. If storage is not configured or fails, falls back gracefully to a compressed Data URL
 *    so the image can be saved directly without errors.
 */
export async function uploadProductImage(
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
  }
  
  try {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}_${randomStr}.${ext}`;
    
    // Call our server-side API to bypass RLS with Service Role Key
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl: compressedDataUrl,
        bucketName: 'products',
        fileName: fileName
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        return {
          url: data.url,
          isStorage: true,
          fileName: file.name,
          sizeKb,
        };
      }
    } else {
       console.warn('API Upload failed:', await response.text());
    }
  } catch (err) {
    console.info('Server upload failed, using direct compressed image.', err);
  }
  
  // Fallback to high-quality compressed Base64 data URL
  return {
    url: compressedDataUrl,
    isStorage: false,
    fileName: file.name,
    sizeKb,
  };
}

/**
 * Uploads a base64 Data URL directly to Supabase Storage.
 * Used for background syncing of legacy local images.
 */
export async function uploadBase64Image(
  dataUrl: string,
  bucketName = 'products',
  fileNamePrefix = 'sync'
): Promise<string> {
  if (!dataUrl.startsWith('data:image/')) return dataUrl;
  
  try {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const match = dataUrl.match(/^data:image\/([a-zA-Z]+);/);
    const ext = match ? match[1] : 'jpg';
    const fileName = `${fileNamePrefix}_${timestamp}_${randomStr}.${ext}`;
    
    // Call our server-side API to bypass RLS with Service Role Key
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dataUrl,
        bucketName,
        fileName
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.url) return data.url;
    } else {
      const errText = await response.text();
      console.warn('API Upload failed:', errText);
    }
  } catch (err) {
    console.error(`Background sync upload failed for ${bucketName}:`, err);
  }
  return dataUrl;
}

