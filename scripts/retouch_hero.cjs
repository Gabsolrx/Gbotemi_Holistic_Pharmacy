const sharp = require('sharp');
const fs = require('fs');

async function retouch() {
  const image = sharp('public/hero3.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  function getPixel(x, y) {
    x = Math.max(0, Math.min(width - 1, Math.round(x)));
    y = Math.max(0, Math.min(height - 1, Math.round(y)));
    const idx = (y * width + x) * 3;
    return [data[idx], data[idx + 1], data[idx + 2]];
  }

  function setPixel(x, y, rgb) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (Math.round(y) * width + Math.round(x)) * 3;
    data[idx] = Math.round(rgb[0]);
    data[idx + 1] = Math.round(rgb[1]);
    data[idx + 2] = Math.round(rgb[2]);
  }

  // 1. Counter surface baseline gradient:
  // Counter starts around y=530 down to y=655.
  // Let's sample pure counter at x=950..1150 or the clean table pixels at bottom.
  // Table has subtle depth: at y=530 RGB ~(215, 215, 216), at y=650 RGB ~(222, 220, 221).
  function getCounterColor(x, y) {
    const t = (y - 530) / (655 - 530);
    const base = 215 + t * 7;
    // subtle lighting noise
    const noise = ((x * 13 + y * 7) % 5) - 2;
    return [base + noise, base - 1 + noise, base + 1 + noise];
  }

  // 2. Pharmacist lab coat texture sample for x in [638..810]:
  // Lab coat at y in [350..530]:
  function getLabCoatColor(x, y) {
    // Sample pharmacist coat from above (e.g. y around 380..420 at matching x)
    const sampleY = Math.min(410, 370 + ((y - 420) * 0.3));
    const [r, g, b] = getPixel(x, sampleY);
    // Add subtle shadow near counter contact (y near 525..535)
    let shadow = 1;
    if (y > 515 && y <= 535) {
      shadow = 0.95 - (0.05 * (y - 515) / 20);
    }
    return [r * shadow, g * shadow, b * shadow];
  }

  // 3. Monitor base / background between customer and pharmacist:
  // x in [455..580], y in [425..530]:
  // Computer monitor is at x in [480..600], y in [425..495]. Monitor bezel is dark teal/grey ~(32, 60, 68).
  // Table top below monitor starts at y=530.
  function getCenterBackground(x, y) {
    if (y < 495 && x >= 478 && x <= 585) {
      // Monitor bezel sample from x, y=430..440
      const [r, g, b] = getPixel(x, 435);
      return [r, g, b];
    } else if (y >= 495 && y < 530) {
      // Monitor stand and rear counter shadow
      const t = (y - 495) / 35;
      const r = 40 + t * 160;
      const g = 65 + t * 145;
      const b = 75 + t * 140;
      return [r, g, b];
    } else {
      return getCounterColor(x, y);
    }
  }

  // PATCH AREA 1: Center table clutter (Apetamin box & bottle, and central tablet)
  // x: 450 to 595, y: 430 to 655
  for (let y = 430; y < 655; y++) {
    for (let x = 450; x <= 595; x++) {
      if (y >= 530) {
        setPixel(x, y, getCounterColor(x, y));
      } else {
        setPixel(x, y, getCenterBackground(x, y));
      }
    }
  }

  // PATCH AREA 2: Duplicate Calgovit Vitamin C tube
  // In hero3.jpeg, tube 1 is at x in [598..636]. Tube 2 (DUPLICATE) is at x in [638..682].
  // We keep tube 1 (x in [598..636]), and remove tube 2 (x in [638..682])!
  for (let y = 425; y < 655; y++) {
    for (let x = 638; x <= 682; x++) {
      if (y >= 530) {
        setPixel(x, y, getCounterColor(x, y));
      } else {
        setPixel(x, y, getLabCoatColor(x, y));
      }
    }
  }

  // PATCH AREA 3: Gascol blue bottles
  // Gascol 1 and 2 are at x in [683..802], y in [430..655]
  for (let y = 425; y < 655; y++) {
    for (let x = 683; x <= 802; x++) {
      if (y >= 530) {
        setPixel(x, y, getCounterColor(x, y));
      } else {
        setPixel(x, y, getLabCoatColor(x, y));
      }
    }
  }

  // PATCH AREA 4: Remove table clutter of Reload / Gaviscon box spilling toward middle
  // Keep reload box on far right edge (x >= 880) or clean the table at x in [803..880], y in [535..655]
  for (let y = 535; y < 655; y++) {
    for (let x = 803; x <= 875; x++) {
      setPixel(x, y, getCounterColor(x, y));
    }
  }

  // Smooth blending / feathering along patch seams
  // Horizontal seams:
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 430; y < 655; y++) {
      for (const edgeX of [449, 450, 595, 596, 637, 638, 682, 683, 802, 803, 875, 876]) {
        if (edgeX > 2 && edgeX < width - 2) {
          const p1 = getPixel(edgeX - 1, y);
          const p2 = getPixel(edgeX, y);
          const p3 = getPixel(edgeX + 1, y);
          setPixel(edgeX, y, [
            (p1[0] + p2[0] * 2 + p3[0]) / 4,
            (p1[1] + p2[1] * 2 + p3[1]) / 4,
            (p1[2] + p2[2] * 2 + p3[2]) / 4,
          ]);
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 95 })
    .toFile('public/hero3_clean.jpeg');

  console.log('Successfully created public/hero3_clean.jpeg');
}

retouch();
