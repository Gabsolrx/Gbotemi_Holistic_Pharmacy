const sharp = require('sharp');

async function findBBoxes() {
  const { data, info } = await sharp('public/hero3.jpeg').raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // 1. Detect Gascol blue bottles:
  let minXBlue = width, maxXBlue = 0, minYBlue = height, maxYBlue = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (b > 180 && r < 50 && g > 70) {
        if (x < minXBlue) minXBlue = x;
        if (x > maxXBlue) maxXBlue = x;
        if (y < minYBlue) minYBlue = y;
        if (y > maxYBlue) maxYBlue = y;
      }
    }
  }
  console.log('Blue Gascol bottles bounding box: x:', minXBlue, 'to', maxXBlue, 'y:', minYBlue, 'to', maxYBlue);

  // 2. Detect Vitamin C orange text/stripes:
  let minXVitC = width, maxXVitC = 0, minYVitC = height, maxYVitC = 0;
  for (let y = 350; y < 650; y++) {
    for (let x = 580; x < 720; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Orange detection: high R, medium G, low B
      if (r > 200 && g > 90 && g < 160 && b < 70) {
        if (x < minXVitC) minXVitC = x;
        if (x > maxXVitC) maxXVitC = x;
        if (y < minYVitC) minYVitC = y;
        if (y > maxYVitC) maxYVitC = y;
      }
    }
  }
  console.log('Vitamin C tubes bounding box: x:', minXVitC, 'to', maxXVitC, 'y:', minYVitC, 'to', maxYVitC);

  // 3. Detect Apetamin orange box:
  let minXApet = width, maxXApet = 0, minYApet = height, maxYApet = 0;
  for (let y = 350; y < 650; y++) {
    for (let x = 400; x < 600; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r > 210 && g > 110 && g < 180 && b < 60) {
        if (x < minXApet) minXApet = x;
        if (x > maxXApet) maxXApet = x;
        if (y < minYApet) minYApet = y;
        if (y > maxYApet) maxYApet = y;
      }
    }
  }
  console.log('Apetamin box bounding box: x:', minXApet, 'to', maxXApet, 'y:', minYApet, 'to', maxYApet);
}

findBBoxes();
