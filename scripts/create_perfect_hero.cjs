const sharp = require('sharp');

async function createPerfectHero() {
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
    data3[i] = Math.max(0, Math.min(255, Math.round(rgb[0])));
    data3[i + 1] = Math.max(0, Math.min(255, Math.round(rgb[1])));
    data3[i + 2] = Math.max(0, Math.min(255, Math.round(rgb[2])));
  }

  function getP1(x, y) {
    x = Math.max(0, Math.min(width - 1, Math.round(x)));
    y = Math.max(0, Math.min(height - 1, Math.round(y)));
    const i = (y * width + x) * 3;
    return [data1[i], data1[i + 1], data1[i + 2]];
  }

  // 1. Pharmacist white coat seamless continuation down to the counter:
  // Duplicate Vitamin C tube is at x in [640..685], y in [425..610].
  // Between y=425 and y=530: her coat continues down to counter level.
  // Sample source: her real coat at x + 25, y = 350 + (y - 425) * 0.4
  for (let y = 420; y <= 530; y++) {
    for (let x = 640; x <= 685; x++) {
      const srcY = 350 + (y - 420) * 0.5;
      const srcX = x + 25;
      const [r, g, b] = getP3(srcX, srcY);
      
      let weight = 1.0;
      if (x < 644) weight = (x - 639) / 5;
      if (x > 680) weight = (686 - x) / 6;

      const [origR, origG, origB] = getP3(x, y);
      setP3(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // 2. Gascol blue bottles removal (x in [835..965], y in [480..635]):
  // In hero3.jpeg, above the bottles (y in [430..530]), behind is the pharmacist's white shelf / counter wall.
  // Sample the white shelf from x in [780..830], y matching.
  for (let y = 480; y <= 530; y++) {
    for (let x = 835; x <= 965; x++) {
      const srcX = 815 - ((x - 835) % 25);
      const [r, g, b] = getP3(srcX, y);

      let weight = 1.0;
      if (x < 845) weight = (x - 834) / 11;
      if (x > 955) weight = (966 - x) / 11;

      const [origR, origG, origB] = getP3(x, y);
      setP3(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // 3. Clear Middle Clutter (Apetamin box & bottle, and central tablet):
  // x in [455..595], y in [425..530]:
  // Behind Apetamin box:
  // x in [455..480]: customer's sleeve / blue shirt. Sample from x - 30.
  // x in [480..560]: monitor screen & lower bezel. Sample from matching x, y = 410..425.
  // x in [560..595]: pharmacist's left white coat. Sample from x in [590..620], y = 370..410.
  for (let y = 425; y <= 530; y++) {
    for (let x = 455; x <= 595; x++) {
      let r, g, b;
      if (x < 480) {
        [r, g, b] = getP3(x - 30, y);
      } else if (x <= 560) {
        // Lower monitor bezel & stand: sample from lower edge of monitor screen at y=422
        const [mR, mG, mB] = getP3(x, 422);
        // add subtle natural darkening for the stand
        const depth = Math.min(1.0, (y - 425) / 80);
        r = mR * (1 - depth * 0.15);
        g = mG * (1 - depth * 0.15);
        b = mB * (1 - depth * 0.15);
      } else {
        const srcX = 610 + (x - 560);
        const srcY = 360 + (y - 425) * 0.4;
        [r, g, b] = getP3(srcX, srcY);
      }

      let weight = 1.0;
      if (x < 462) weight = (x - 454) / 8;
      if (x > 588) weight = (596 - x) / 8;

      const [origR, origG, origB] = getP3(x, y);
      setP3(x, y, [
        origR * (1 - weight) + r * weight,
        origG * (1 - weight) + g * weight,
        origB * (1 - weight) + b * weight
      ]);
    }
  }

  // 4. Clean, Photorealistic White Pharmacy Counter Across the Center & Right (y in [530..655]):
  // In hero3.jpeg, the single Calgovit Vitamin C tube is at x in [598..636].
  // We keep the single Vitamin C tube!
  // All the scattered middle items (tablet, Apetamin base), the duplicate Vitamin C base,
  // and the Gascol bottles base are replaced with the pristine white counter from hero1.jpeg!
  for (let y = 530; y < 655; y++) {
    for (let x = 450; x <= 970; x++) {
      // PRESERVE the single Vitamin C tube (x in [598..636])
      if (x >= 598 && x <= 636 && y < 615) {
        continue;
      }

      // Sample studio white counter from hero1.jpeg
      const [r1, g1, b1] = getP1(x, y);

      let weight = 1.0;
      if (x < 465) weight *= (x - 449) / 16;
      if (x > 955) weight *= (971 - x) / 16;
      if (y < 540) weight *= (y - 529) / 11;

      // Also blend smoothly around the single Vitamin C tube base
      if (x >= 594 && x <= 640 && y < 618) {
        if (x < 598) weight *= (x - 593) / 5;
        if (x > 636) weight *= (641 - x) / 5;
      }

      const [origR, origG, origB] = getP3(x, y);
      setP3(x, y, [
        origR * (1 - weight) + r1 * weight,
        origG * (1 - weight) + g1 * weight,
        origB * (1 - weight) + b1 * weight
      ]);
    }
  }

  // Add realistic soft contact shadow under the single Vitamin C tube
  for (let x = 598; x <= 636; x++) {
    for (let y = 612; y <= 620; y++) {
      const [r, g, b] = getP3(x, y);
      const factor = 0.85 + ((y - 612) / 8) * 0.15;
      setP3(x, y, [r * factor, g * factor, b * factor]);
    }
  }

  // Final 3-pass smoothing on seam lines
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 425; y < 655; y++) {
      for (const edgeX of [452, 458, 480, 560, 595, 638, 642, 684, 835, 965]) {
        for (let dx = -1; dx <= 1; dx++) {
          const curX = edgeX + dx;
          if (curX > 1 && curX < width - 1) {
            const pL = getP3(curX - 1, y);
            const pM = getP3(curX, y);
            const pR = getP3(curX + 1, y);
            setP3(curX, y, [
              (pL[0] + pM[0] * 2 + pR[0]) / 4,
              (pL[1] + pM[1] * 2 + pR[1]) / 4,
              (pL[2] + pM[2] * 2 + pR[2]) / 4
            ]);
          }
        }
      }
    }
  }

  await sharp(data3, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 96 })
    .toFile('public/hero3_perfect.jpeg');

  console.log('Successfully generated public/hero3_perfect.jpeg');
}

createPerfectHero();
