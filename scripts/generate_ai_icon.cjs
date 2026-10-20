const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

function createPng(width, height, getPixelRgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);

  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// 1. High-resolution SVG of the Pharmacy AI Green & White Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Vibrant Emerald Green Badge Gradient -->
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="45%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>

    <!-- Subtle inner shadow for 3D depth -->
    <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#022c22" flood-opacity="0.3" />
    </filter>

    <!-- Drop shadow for the white chat bubble -->
    <filter id="bubbleDrop" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#022c22" flood-opacity="0.22" />
    </filter>
  </defs>

  <!-- Green Circular Badge -->
  <circle cx="256" cy="256" r="240" fill="url(#badgeGrad)" />

  <!-- Clean inner accent ring -->
  <circle cx="256" cy="256" r="238" fill="none" stroke="#A7F3D0" stroke-width="2.5" stroke-opacity="0.45" />

  <!-- White Speech Bubble (AI Healthcare Chat) -->
  <g filter="url(#bubbleDrop)">
    <!-- Speech bubble body and downward pointer -->
    <path 
      d="M 155 130
         C 205 130, 307 130, 357 130
         C 410 130, 436 160, 436 215
         C 436 270, 410 300, 357 300
         C 310 300, 240 300, 215 300
         L 162 352
         C 152 362, 136 355, 140 342
         L 149 300
         C 102 300, 76 270, 76 215
         C 76 160, 102 130, 155 130 Z" 
      fill="#FFFFFF" 
    />
  </g>

  <!-- Centered Pharmacy Cross inside White Bubble (in matching emerald green) -->
  <g fill="#059669">
    <!-- Vertical arm -->
    <rect x="236" y="160" width="40" height="110" rx="9" ry="9" />
    <!-- Horizontal arm -->
    <rect x="201" y="195" width="110" height="40" rx="9" ry="9" />
  </g>
</svg>`;

// Write SVGs to public, src/assets, src/assets/images
const targetDirs = [
  path.join(__dirname, '..', 'public'),
  path.join(__dirname, '..', 'src', 'assets'),
  path.join(__dirname, '..', 'src', 'assets', 'images'),
];

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'pharmacy_ai_green_white.svg'), svgIcon.trim(), 'utf8');
}

// 2. High-Resolution 512x512 Rasterizer to generate exact matching PNG
const SIZE = 512;

function pointInRoundedRect(px, py, rx, ry, rw, rh, rad) {
  const left = rx - rw / 2;
  const right = rx + rw / 2;
  const top = ry - rh / 2;
  const bottom = ry + rh / 2;
  if (px < left || px > right || py < top || py > bottom) return false;
  if (px < left + rad && py < top + rad) return Math.hypot(px - (left + rad), py - (top + rad)) <= rad;
  if (px > right - rad && py < top + rad) return Math.hypot(px - (right - rad), py - (top + rad)) <= rad;
  if (px < left + rad && py > bottom - rad) return Math.hypot(px - (left + rad), py - (bottom - rad)) <= rad;
  if (px > right - rad && py > bottom - rad) return Math.hypot(px - (right - rad), py - (bottom - rad)) <= rad;
  return true;
}

// Function to test if point is inside speech bubble
function inSpeechBubble(px, py) {
  // Main oval / rounded rectangle body: cx = 256, cy = 215, w = 360, h = 170, rad = 50
  const inBody = pointInRoundedRect(px, py, 256, 215, 360, 170, 50);
  if (inBody) return true;

  // Tail triangle at bottom left: vertices roughly (148, 290), (220, 290), (145, 355)
  // Check barycentric or triangle point
  function ptInTriangle(p, p0, p1, p2) {
    const dX = p.x - p2.x;
    const dY = p.y - p2.y;
    const dX21 = p2.x - p1.x;
    const dY12 = p1.y - p2.y;
    const D = dY12 * (p0.x - p2.x) + dX21 * (p0.y - p2.y);
    const s = dY12 * dX + dX21 * dY;
    const t = (p2.y - p0.y) * dX + (p0.x - p2.x) * dY;
    if (D < 0) return s <= 0 && t <= 0 && s + t >= D;
    return s >= 0 && t >= 0 && s + t <= D;
  }

  const p = { x: px, y: py };
  const p0 = { x: 146, y: 285 };
  const p1 = { x: 220, y: 285 };
  const p2 = { x: 148, y: 350 };
  if (ptInTriangle(p, p0, p1, p2)) return true;

  // Rounded tip at tail bottom
  if (Math.hypot(px - 148, py - 346) <= 8) return true;

  return false;
}

// Test if point is in green pharmacy cross
function inPharmacyCross(px, py) {
  const inVert = pointInRoundedRect(px, py, 256, 215, 40, 110, 9);
  const inHoriz = pointInRoundedRect(px, py, 256, 215, 110, 40, 9);
  return inVert || inHoriz;
}

const pngBuffer = createPng(SIZE, SIZE, (x, y, w, h) => {
  const cx = w / 2;
  const cy = h / 2;
  const dist = Math.hypot(x - cx, y - cy);
  const rCircle = 240;

  if (dist > rCircle + 1) {
    return [0, 0, 0, 0]; // Transparent outside circle
  }

  let alpha = 1;
  if (dist > rCircle - 1) {
    alpha = Math.max(0, Math.min(1, rCircle + 1 - dist));
  }

  // Green gradient for the circular badge
  const t = (x / w + y / h) / 2;
  const rBg = Math.round(16 * (1 - t) + 4 * t);
  const gBg = Math.round(185 * (1 - t) + 120 * t);
  const bBg = Math.round(129 * (1 - t) + 87 * t);

  // Check if inside speech bubble
  if (inSpeechBubble(x, y)) {
    // Check if inside green pharmacy cross
    if (inPharmacyCross(x, y)) {
      return [5, 150, 105, Math.round(alpha * 255)]; // Emerald green cross
    }
    return [255, 255, 255, Math.round(alpha * 255)]; // Pure white bubble
  }

  // Inner ring accent
  if (dist > rCircle - 3 && dist <= rCircle) {
    return [167, 243, 208, Math.round(alpha * 180)];
  }

  return [rBg, gBg, bBg, Math.round(alpha * 255)];
});

for (const dir of targetDirs) {
  fs.writeFileSync(path.join(dir, 'pharmacy_ai_green_white.png'), pngBuffer);
}

// Also write to dist if it exists
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'pharmacy_ai_green_white.svg'), svgIcon.trim(), 'utf8');
  fs.writeFileSync(path.join(distDir, 'pharmacy_ai_green_white.png'), pngBuffer);
}

console.log('Successfully generated pharmacy_ai_green_white SVG and PNG across directories.');
