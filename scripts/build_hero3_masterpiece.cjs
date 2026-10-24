const sharp = require('sharp');

async function buildHero3Final() {
  // 1. Crop upper consultation scene from hero3.jpeg (y: 20 to 395)
  // width: 960 (x: 120 to 1080), height: 375
  const facesBuffer = await sharp('public/hero3.jpeg')
    .extract({ left: 120, top: 20, width: 960, height: 375 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = facesBuffer.info; // 960 x 375
  const totalHeight = 540; // 960 x 540 = standard 16:9 aspect ratio!

  const combined = Buffer.alloc(width * totalHeight * 3);

  // Copy facesBuffer to top
  facesBuffer.data.copy(combined, 0, 0, width * height * 3);

  // Extract the single Calgovit Vitamin C tube from hero3.jpeg
  const vitCTube = await sharp('public/hero3.jpeg')
    .extract({ left: 598, top: 428, width: 38, height: 182 })
    .resize(32, 150)
    .toBuffer();

  // Extract clean medicine box (Boneflex/Malaria box) from hero3.jpeg
  const medBox = await sharp('public/hero3.jpeg')
    .extract({ left: 155, top: 490, width: 110, height: 140 })
    .resize(90, 115)
    .toBuffer();

  // Render clean, luminous pharmacy counter at y in [370..540]:
  for (let y = 370; y < totalHeight; y++) {
    const t = (y - 370) / (totalHeight - 370); // 0 to 1
    const baseR = 220 + t * 5;
    const baseG = 222 + t * 4;
    const baseB = 225 + t * 3;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      
      // Subtle noise
      const noise = (((x * 13 + y * 29) % 7) - 3) * 0.4;
      const r = baseR + noise;
      const g = baseG + noise;
      const b = baseB + noise;

      if (y < 380) {
        // Blend seam
        const blend = (y - 370) / 10;
        combined[idx] = Math.round(combined[idx] * (1 - blend) + r * blend);
        combined[idx + 1] = Math.round(combined[idx + 1] * (1 - blend) + g * blend);
        combined[idx + 2] = Math.round(combined[idx + 2] * (1 - blend) + b * blend);
      } else {
        combined[idx] = Math.round(r);
        combined[idx + 1] = Math.round(g);
        combined[idx + 2] = Math.round(b);
      }
    }
  }

  // Soft blur along seam
  for (let y = 368; y <= 382; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idxL = (y * width + (x - 1)) * 3;
      const idxM = (y * width + x) * 3;
      const idxR = (y * width + (x + 1)) * 3;
      combined[idxM] = Math.round((combined[idxL] + combined[idxM] * 2 + combined[idxR]) / 4);
      combined[idxM + 1] = Math.round((combined[idxL + 1] + combined[idxM + 1] * 2 + combined[idxR + 1]) / 4);
      combined[idxM + 2] = Math.round((combined[idxL + 2] + combined[idxM + 2] * 2 + combined[idxR + 2]) / 4);
    }
  }

  // Composite remaining medications neatly to ONE SIDE (left side of counter):
  // 1. Medicine box at x: 80, y: 395
  // 2. Single Calgovit Vitamin C tube at x: 185, y: 360
  // Leaving the entire center and right of the counter 100% clean and unscattered!
  const baseImg = sharp(combined, { raw: { width, height: totalHeight, channels: 3 } });

  await baseImg
    .composite([
      {
        input: medBox,
        top: 405,
        left: 90,
      },
      {
        input: vitCTube,
        top: 370,
        left: 195,
      }
    ])
    .jpeg({ quality: 96 })
    .toFile('public/hero3_masterpiece.jpeg');

  console.log('Successfully created public/hero3_masterpiece.jpeg');
}

buildHero3Final();
