const sharp = require('sharp');

async function renderCleanCounter() {
  const h3Raw = await sharp('public/hero3.jpeg').raw().toBuffer({ resolveWithObject: true });
  const data = h3Raw.data;
  const { width, height } = h3Raw.info; // 1200 x 655

  // Extract the single Calgovit Vitamin C tube cleanly
  // x: 598 to 636, y: 428 to 610
  const vitCTube = await sharp('public/hero3.jpeg')
    .extract({ left: 598, top: 428, width: 38, height: 182 })
    .toBuffer();

  // Extract a clean medicine box from the left (Boneflex/Vitamins, x: 155 to 265, y: 490 to 630)
  const medBox = await sharp('public/hero3.jpeg')
    .extract({ left: 155, top: 490, width: 110, height: 140 })
    .toBuffer();

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

  // Generate pure, photorealistic pharmacy counter across the whole bottom (y: 515..655)
  // Clean smooth clinical white surface with natural soft perspective lighting
  for (let y = 515; y < height; y++) {
    const t = (y - 515) / (height - 515); // 0 to 1
    // Base counter gradient: soft clinical white
    const baseR = 217 + t * 6;
    const baseG = 218 + t * 5;
    const baseB = 221 + t * 4;

    for (let x = 0; x < width; x++) {
      // Subtle natural vignette towards the edges
      const edgeDist = Math.abs(x - width / 2) / (width / 2);
      const vign = 1.0 - edgeDist * 0.03;
      
      // Extremely subtle natural surface noise (0.5%)
      const noise = (((x * 17 + y * 31) % 7) - 3) * 0.4;

      const r = (baseR + noise) * vign;
      const g = (baseG + noise) * vign;
      const b = (baseB + noise) * vign;

      // Soft transition from upper scene to counter at y in [515..528]
      if (y < 528) {
        const blend = (y - 515) / 13;
        const [origR, origG, origB] = getPixel(x, y);
        setPixel(x, y, [
          origR * (1 - blend) + r * blend,
          origG * (1 - blend) + g * blend,
          origB * (1 - blend) + b * blend
        ]);
      } else {
        setPixel(x, y, [r, g, b]);
      }
    }
  }

  // Pharmacist white lab coat clean drape at y in [425..520], x in [638..830]:
  // Her coat hangs down naturally from y=420 to the counter at y=520
  for (let y = 425; y <= 520; y++) {
    for (let x = 638; x <= 820; x++) {
      const srcY = 380 + (y - 425) * 0.2;
      const [r, g, b] = getPixel(x, srcY);
      
      let weight = 1.0;
      if (x < 645) weight = (x - 637) / 8;
      if (x > 810) weight = (821 - x) / 11;
      if (y < 432) weight *= (y - 424) / 8;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // Customer blue shirt drape at y in [425..520], x in [300..450]:
  for (let y = 430; y <= 520; y++) {
    for (let x = 360; x <= 450; x++) {
      const srcY = 400 + (y - 430) * 0.2;
      const [r, g, b] = getPixel(x, srcY);
      
      let weight = 1.0;
      if (x < 370) weight = (x - 359) / 11;
      if (x > 440) weight = (451 - x) / 11;
      if (y < 436) weight *= (y - 429) / 7;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // Center background (monitor stand and wall between customer and pharmacist, x in [450..580], y in [425..520]):
  for (let y = 425; y <= 520; y++) {
    for (let x = 450; x <= 580; x++) {
      // Sample monitor bezel / lower screen from y=422
      const [mR, mG, mB] = getPixel(x, 422);
      const depth = (y - 425) / 95;
      const shadow = 0.95 - depth * 0.1;

      let weight = 1.0;
      if (x < 460) weight = (x - 449) / 11;
      if (x > 570) weight = (581 - x) / 11;
      if (y < 432) weight *= (y - 424) / 8;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + mR * shadow * weight,
        origG * (1 - weight) + mG * shadow * weight,
        origB * (1 - weight) + mB * shadow * weight
      ]);
    }
  }

  // Soft blur filter over modified transitions
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 425; y < 535; y++) {
      for (let x = 360; x <= 820; x++) {
        const pL = getPixel(x - 1, y);
        const pM = getPixel(x, y);
        const pR = getPixel(x + 1, y);
        const pU = getPixel(x, y - 1);
        const pD = getPixel(x, y + 1);
        setPixel(x, y, [
          (pL[0] + pR[0] + pU[0] + pD[0] + pM[0] * 4) / 8,
          (pL[1] + pR[1] + pU[1] + pD[1] + pM[1] * 4) / 8,
          (pL[2] + pR[2] + pU[2] + pD[2] + pM[2] * 4) / 8
        ]);
      }
    }
  }

  // Now, place the remaining drugs neatly on ONE SIDE of the counter:
  // On the right side next to the pharmacist (x in [800..950]):
  // Single Calgovit Vitamin C tube + neat medicine box, leaving the center table 100% clean!
  const baseImg = sharp(data, { raw: { width, height, channels: 3 } });

  await baseImg
    .composite([
      // Clean medicine box on one side (left side or right side):
      {
        input: medBox,
        top: 505,
        left: 140, // neatly on the left side
      },
      // Single Calgovit Vitamin C tube neatly placed on the side:
      {
        input: vitCTube,
        top: 465,
        left: 265, // right beside the medicine box on the left side!
      }
    ])
    .jpeg({ quality: 96 })
    .toFile('public/hero3_clean_table.jpeg');

  console.log('Successfully created public/hero3_clean_table.jpeg');
}

renderCleanCounter();
