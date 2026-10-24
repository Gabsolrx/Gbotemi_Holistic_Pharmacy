const sharp = require('sharp');
const fs = require('fs');

async function retouchRealistic() {
  const h3Raw = await sharp('public/hero3.jpeg').raw().toBuffer({ resolveWithObject: true });
  const h1Raw = await sharp('public/hero1.jpeg').raw().toBuffer({ resolveWithObject: true });

  const data3 = h3Raw.data;
  const data1 = h1Raw.data;
  const { width, height } = h3Raw.info; // 1200 x 655

  function getP3(x, y) {
    x = Math.max(0, Math.min(width - 1, Math.round(x)));
    y = Math.max(0, Math.min(height - 1, Math.round(y)));
    const i = (y * width + x) * 3;
    return [data3[i], data3[i + 1], data3[i + 2]];
  }

  function setP3(x, y, rgb) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = (Math.round(y) * width + Math.round(x)) * 3;
    data3[i] = Math.round(rgb[0]);
    data3[i + 1] = Math.round(rgb[1]);
    data3[i + 2] = Math.round(rgb[2]);
  }

  function getP1(x, y) {
    x = Math.max(0, Math.min(width - 1, Math.round(x)));
    y = Math.max(0, Math.min(height - 1, Math.round(y)));
    const i = (y * width + x) * 3;
    return [data1[i], data1[i + 1], data1[i + 2]];
  }

  // 1. Pharmacist white coat clean extension:
  // In hero3.jpeg, her coat above the duplicate Vitamin C and Gascol is at y in [320..420], x in [638..810].
  // Between y=420 and y=525, we continue the authentic lab coat texture down to counter level.
  for (let x = 638; x <= 805; x++) {
    for (let y = 422; y <= 525; y++) {
      // Sample source Y from real lab coat above
      // Add subtle natural perspective drape
      const progress = (y - 422) / (525 - 422);
      const srcY = 360 + Math.round(progress * 55);
      const [r, g, b] = getP3(x, srcY);

      // Natural soft lighting towards the counter
      const shade = 1.0 - (progress * 0.04);
      setP3(x, y, [r * shade, g * shade, b * shade]);
    }
  }

  // 2. Behind Apetamin box & bottle (x in [455..595], y in [425..525]):
  // In hero3.jpeg:
  // At x in [455..485], customer's arm / empty space:
  // At x in [485..560], the monitor screen & bezel:
  // At x in [560..595], pharmacist's left lab coat:
  for (let y = 425; y <= 525; y++) {
    for (let x = 455; x <= 595; x++) {
      if (x < 482) {
        // Space next to customer's arm: blend from customer's shirt / back wall
        const srcY = Math.min(420, 390 + (y - 425) * 0.2);
        const [r, g, b] = getP3(x, srcY);
        setP3(x, y, [r, g, b]);
      } else if (x >= 482 && x <= 555) {
        // Lower monitor bezel & stand: sample from monitor bottom at y=420..435
        const srcY = 425 + Math.min(10, Math.round((y - 425) * 0.1));
        const [r, g, b] = getP3(x, srcY);
        // add subtle shadow under monitor
        const t = (y - 425) / 100;
        const shadow = 0.9 + t * 0.1;
        setP3(x, y, [r * shadow, g * shadow, b * shadow]);
      } else {
        // Pharmacist's left coat drape
        const srcY = 360 + Math.round((y - 425) * 0.5);
        const [r, g, b] = getP3(x, srcY);
        setP3(x, y, [r, g, b]);
      }
    }
  }

  // 3. Pristine Counter Table Top (x in [450..870], y in [525..655]):
  // Seamlessly composite the clean photorealistic counter table from hero1.jpeg
  // which has authentic lighting, edge highlight, and soft natural reflection!
  for (let y = 525; y < 655; y++) {
    for (let x = 450; x <= 870; x++) {
      // In hero3, tube 1 of Vitamin C is at x in [598..636], y in [425..610].
      // We must PRESERVE tube 1 so there is exactly ONE Vitamin C tube on the counter!
      if (x >= 598 && x <= 636 && y <= 612) {
        continue; // Keep single Vitamin C tube intact!
      }

      // Sample clean counter from hero1.jpeg
      const [r1, g1, b1] = getP1(x, y);

      // Feather horizontal edges (x near 450, x near 870) and top counter seam (y near 525)
      let blendWeight = 1.0;
      if (x < 470) blendWeight *= (x - 450) / 20;
      if (x > 850) blendWeight *= (870 - x) / 20;
      if (y < 535) blendWeight *= (y - 525) / 10;

      const [r3, g3, b3] = getP3(x, y);
      setP3(x, y, [
        r3 * (1 - blendWeight) + r1 * blendWeight,
        g3 * (1 - blendWeight) + g1 * blendWeight,
        b3 * (1 - blendWeight) + g1 * blendWeight,
      ]);
    }
  }

  // 4. Subtle contact shadow at the base of the single Vitamin C tube (y around 610..615, x in [596..638]):
  for (let x = 596; x <= 638; x++) {
    for (let y = 610; y <= 618; y++) {
      const [r, g, b] = getP3(x, y);
      const intensity = 0.82 + ((y - 610) / 8) * 0.18;
      setP3(x, y, [r * intensity, g * intensity, b * intensity]);
    }
  }

  // Gaussian blur / box filter along seams for flawless photorealistic finish
  for (let y = 422; y < 655; y++) {
    for (const seamX of [452, 453, 482, 483, 555, 556, 597, 637, 804, 805, 869, 870]) {
      if (seamX > 2 && seamX < width - 2) {
        const pL = getP3(seamX - 1, y);
        const pM = getP3(seamX, y);
        const pR = getP3(seamX + 1, y);
        setP3(seamX, y, [
          (pL[0] + pM[0] * 2 + pR[0]) / 4,
          (pL[1] + pM[1] * 2 + pR[1]) / 4,
          (pL[2] + pM[2] * 2 + pR[2]) / 4,
        ]);
      }
    }
  }

  await sharp(data3, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 96 })
    .toFile('public/hero3_retouched.jpeg');

  console.log('Successfully generated public/hero3_retouched.jpeg');
}

retouchRealistic();
