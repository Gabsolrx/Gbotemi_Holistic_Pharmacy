const sharp = require('sharp');

async function retouchV2() {
  const { data, info } = await sharp('public/hero3.jpeg').raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  function getPixel(x, y) {
    x = Math.max(0, Math.min(width - 1, Math.round(x)));
    y = Math.max(0, Math.min(height - 1, Math.round(y)));
    const i = (y * width + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  }

  function setPixel(x, y, rgb) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = (Math.round(y) * width + Math.round(x)) * 3;
    data[i] = Math.round(rgb[0]);
    data[i + 1] = Math.round(rgb[1]);
    data[i + 2] = Math.round(rgb[2]);
  }

  // 1. Remove duplicate Vitamin C tube at x in [667..685]:
  // Clone lab coat texture from x in [688..706] with soft edge feathering
  for (let y = 370; y < 620; y++) {
    for (let x = 666; x <= 686; x++) {
      const offsetX = 22; // sample from coat at x + 22
      const [r, g, b] = getPixel(x + offsetX, y);
      
      // Feather left and right edges
      let weight = 1.0;
      if (x < 669) weight = (x - 665) / 4;
      if (x > 683) weight = (687 - x) / 4;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // 2. Remove blue Gascol bottles at x in [842..968], y in [480..635]:
  // Gascol 1 & 2 are in front of the white counter and shelf background.
  // Sample clean shelf & counter texture from x in [760..840] or clean table
  for (let y = 480; y < 640; y++) {
    for (let x = 842; x <= 968; x++) {
      let r, g, b;
      if (y < 535) {
        // Shelf background above counter: sample from x - 95
        const srcX = Math.max(760, x - 100);
        [r, g, b] = getPixel(srcX, y);
      } else {
        // Clean counter surface: sample from clean counter at x - 140
        const srcX = x - 140;
        [r, g, b] = getPixel(srcX, y);
      }

      // Soft feathering at borders
      let weight = 1.0;
      if (x < 848) weight = (x - 841) / 7;
      if (x > 960) weight = (969 - x) / 9;
      if (y < 488) weight *= (y - 479) / 9;
      if (y > 630) weight *= (640 - y) / 10;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // 3. Clear middle table scattering (Apetamin box & bottle, and tablet at x in [455..585]):
  // In the center, between customer and pharmacist:
  // Above counter (y in [430..530]):
  // Monitor bezel is at y in [430..495]. Bottom stand at y in [495..530].
  // Counter table is at y in [530..650].
  for (let y = 430; y < 650; y++) {
    for (let x = 458; x <= 585; x++) {
      let r, g, b;
      if (y < 495) {
        // Sample monitor bottom
        const sampleY = 432;
        [r, g, b] = getPixel(x, sampleY);
      } else if (y >= 495 && y < 530) {
        // Soft neutral shadow under monitor stand
        const t = (y - 495) / 35;
        r = 60 + t * 140;
        g = 70 + t * 135;
        b = 75 + t * 135;
      } else {
        // Clean white counter: sample from clean counter surface at x=350, matching y
        const [cntR, cntG, cntB] = getPixel(350, y);
        r = cntR;
        g = cntG;
        b = cntB;
      }

      let weight = 1.0;
      if (x < 464) weight = (x - 457) / 7;
      if (x > 578) weight = (586 - x) / 8;
      if (y < 436) weight *= (y - 429) / 7;

      const [origR, origG, origB] = getPixel(x, y);
      setPixel(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // Smooth filter over modified regions
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 370; y < 640; y++) {
      for (const x of [666, 686, 842, 968, 458, 585]) {
        for (let dx = -2; dx <= 2; dx++) {
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
    .toFile('public/hero3_clean_v2.jpeg');

  console.log('Successfully created public/hero3_clean_v2.jpeg');
}

retouchV2();
