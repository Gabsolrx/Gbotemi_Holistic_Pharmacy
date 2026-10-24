const sharp = require('sharp');

async function buildCleanHero() {
  const h3Raw = await sharp('public/hero3.jpeg').raw().toBuffer({ resolveWithObject: true });
  const h1Raw = await sharp('public/hero1.jpeg').raw().toBuffer({ resolveWithObject: true });
  const { width, height } = h3Raw.info; // 1200 x 655

  // Extract a clean, pristine single Vitamin C tube from hero3.jpeg
  // The first tube is at x in [598..636], y in [428..610]
  const vitCTube = await sharp('public/hero3.jpeg')
    .extract({ left: 598, top: 428, width: 38, height: 182 })
    .toBuffer();

  // Create clean base by combining the upper consultation scene (y: 0..485)
  // with the studio pharmacy counter from hero1.jpeg (y: 485..655)
  const data3 = h3Raw.data;
  const data1 = h1Raw.data;

  const outBuffer = Buffer.alloc(width * height * 3);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;

      if (y < 460) {
        // Pure upper consultation from hero3.jpeg
        outBuffer[idx] = data3[idx];
        outBuffer[idx + 1] = data3[idx + 1];
        outBuffer[idx + 2] = data3[idx + 2];
      } else if (y >= 460 && y < 510) {
        // Smooth transition zone
        // For customer (x in [200..450]): keep customer's blue shirt
        // For pharmacist (x in [580..820]): keep pharmacist's white lab coat
        // For center (x in [450..580]): transition to monitor stand and counter
        const t = (y - 460) / 50; // 0 to 1

        let isPerson = false;
        if (x >= 220 && x <= 440) isPerson = true; // customer
        if (x >= 600 && x <= 800) isPerson = true; // pharmacist

        if (isPerson) {
          // Keep authentic person fabric with gentle lighting
          outBuffer[idx] = data3[idx];
          outBuffer[idx + 1] = data3[idx + 1];
          outBuffer[idx + 2] = data3[idx + 2];
        } else {
          // Background / counter blend
          const r3 = data3[idx], g3 = data3[idx+1], b3 = data3[idx+2];
          const r1 = data1[idx], g1 = data1[idx+1], b1 = data1[idx+2];
          outBuffer[idx] = Math.round(r3 * (1 - t) + r1 * t);
          outBuffer[idx + 1] = Math.round(g3 * (1 - t) + g1 * t);
          outBuffer[idx + 2] = Math.round(b3 * (1 - t) + b1 * t);
        }
      } else {
        // Counter level (y >= 510):
        // On the left side (x in [80..380]): keep the customer's medicines neatly on the left side!
        // At the center (x in [380..900]): clean white pharmacy counter from hero1.jpeg!
        // On the far right (x > 900): clean counter!
        if (x < 380 && y > 490) {
          // Keep the neatly organized medicine boxes on the left side (Antimalarial, Boneflex, Lomovap)
          outBuffer[idx] = data3[idx];
          outBuffer[idx + 1] = data3[idx + 1];
          outBuffer[idx + 2] = data3[idx + 2];
        } else if (x >= 380 && x < 420) {
          // Feather transition from left medicines to clean counter
          const weight = (x - 380) / 40;
          outBuffer[idx] = Math.round(data3[idx] * (1 - weight) + data1[idx] * weight);
          outBuffer[idx + 1] = Math.round(data3[idx + 1] * (1 - weight) + data1[idx + 1] * weight);
          outBuffer[idx + 2] = Math.round(data3[idx + 2] * (1 - weight) + data1[idx + 2] * weight);
        } else {
          // Clean pristine studio white counter from hero1.jpeg
          outBuffer[idx] = data1[idx];
          outBuffer[idx + 1] = data1[idx + 1];
          outBuffer[idx + 2] = data1[idx + 2];
        }
      }
    }
  }

  // Composite the single Vitamin C tube neatly on the pharmacist's counter side at x=780, y=435
  const baseImg = sharp(outBuffer, { raw: { width, height, channels: 3 } });
  
  await baseImg
    .composite([
      {
        input: vitCTube,
        top: 435,
        left: 780,
      }
    ])
    .jpeg({ quality: 96 })
    .toFile('public/hero3_clean_final.jpeg');

  console.log('Successfully generated public/hero3_clean_final.jpeg');
}

buildCleanHero();
