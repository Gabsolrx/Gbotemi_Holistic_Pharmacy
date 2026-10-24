const sharp = require('sharp');
const fs = require('fs');

async function analyze() {
  const meta = await sharp('public/hero3.jpeg').metadata();
  console.log('Image dimensions:', meta.width, meta.height);
}

analyze();
