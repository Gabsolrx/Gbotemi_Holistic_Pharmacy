const sharp = require('sharp');

async function retouch460() {
  const cropRaw = await sharp('public/hero3_crop_460.jpeg').raw().toBuffer({ resolveWithObject: true });
  const data = cropRaw.data;
  const { width, height } = cropRaw.info; // 920 x 460

  function getPixel(x, y) {
    x = Math.max(0, Math.min(width - 1, Math.round(x)));
    y = Math.max(0, Math.min(height - 1, Math.round(y)));
    const i = (y * width + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  }

  function setPixel(x, y, rgb) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = (Math.round(y) * width + Math.round(x)) * 3;
    data[i] = Math.max(0, Math.min(255, Math.round(rgb[0])));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(rgb[1])));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(rgb[2])));
  }

  // 1. Remove duplicate Vitamin C tube at x in [620..654], y in [395..460]:
  // Pharmacist white lab coat is above at y in [340..395].
  for (let y = 395; y < height; y++) {
    for (let x = 620; x <= 654; x++) {
      // Sample source Y from real coat above (y=360..390)
      const srcY = 365 + ((y - 395) * 0.4);
      const [r, g, b] = getPixel(x + 10, srcY);

      let weight = 1.0;
      if (x < 624) weight = (x - 619) / 5;
      if (x > 649) weight = (655 - x) / 6;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // 2. Remove Gascol blue bottle at x in [708..815], y in [400..460]:
  // Pharmacist white lab coat is above at y in [340..400].
  for (let y = 400; y < height; y++) {
    for (let x = 708; x <= 815; x++) {
      const srcY = 360 + ((y - 400) * 0.4);
      const [r, g, b] = getPixel(x, srcY);

      let weight = 1.0;
      if (x < 716) weight = (x - 707) / 9;
      if (x > 805) weight = (816 - x) / 11;
      if (y < 408) weight *= (y - 399) / 9;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // 3. Remove Apetamin box & bottle from the center (x in [405..535], y in [375..460]):
  // In the center, between customer and pharmacist:
  // x in [405..435]: customer's blue sleeve (sample from x - 25, y = 370..420)
  // x in [435..520]: monitor bezel / stand (sample from y=365..378)
  // x in [520..535]: pharmacist's white coat (sample from x + 40, y = 360..390)
  for (let y = 375; y < height; y++) {
    for (let x = 405; x <= 535; x++) {
      let r, g, b;
      if (x < 432) {
        // Customer sleeve
        const [sR, sG, sB] = getPixel(x - 25, Math.min(410, y - 10));
        r = sR; g = sG; b = sB;
      } else if (x <= 515) {
        // Monitor bezel & stand
        const [mR, mG, mB] = getPixel(x, 372);
        const depth = (y - 375) / 85;
        r = mR * (1 - depth * 0.12);
        g = mG * (1 - depth * 0.12);
        b = mB * (1 - depth * 0.12);
      } else {
        // Pharmacist coat
        const [cR, cG, cB] = getPixel(x + 40, 370 + (y - 375) * 0.3);
        r = cR; g = cG; b = cB;
      }

      let weight = 1.0;
      if (x < 413) weight = (x - 404) / 9;
      if (x > 527) weight = (536 - x) / 9;
      if (y < 382) weight *= (y - 374) / 8;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // Smooth filter over seams
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 375; y < height; y++) {
      for (const x of [408, 432, 515, 532, 620, 654, 712, 810]) {
        for (let dx = -1; dx <= 1; dx++) {
          const curX = x + dx;
          if (curX > 0 && curX < width - 1) {
            const pL = getPixel(curX - 1, y);
            const pM = getPixel(curX, y);
            const pR = getPixel(curX + 1, y);
            setPixel(curX, y, [
              (pL[0] + pM[0] * 2 + pR[0]) / 4,
              (pL[1] + pM[1] * 2 + pR[1]) / 4,
              (pL[2] + pM[2] * 2 + pR[2]) / 4
            ]);
          }
        }
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 96 })
    .toFile('public/hero3_seamless_retouched.jpeg');

  console.log('Successfully created public/hero3_seamless_retouched.jpeg');
}

retouch460();
