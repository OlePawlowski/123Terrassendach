const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function convertToWebp() {
  const files = fs.readdirSync(IMAGES_DIR);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!EXTENSIONS.includes(ext)) continue;

    const base = path.basename(file, ext);
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(IMAGES_DIR, base + '.webp');

    try {
      let pipeline = sharp(inputPath);
      const meta = await pipeline.metadata();
      const isPng = ext === '.png';

      await pipeline
        .webp({
          quality: 85,
          effort: 6,
          ...(isPng && meta.hasAlpha ? { alphaQuality: 100 } : {}),
        })
        .toFile(outputPath);

      const inSize = fs.statSync(inputPath).size;
      const outSize = fs.statSync(outputPath).size;
      const saved = Math.round((1 - outSize / inSize) * 100);
      console.log(`${file} → ${base}.webp (${(outSize / 1024).toFixed(1)} KB, -${saved}%)`);
    } catch (err) {
      console.error(`Fehler bei ${file}:`, err.message);
    }
  }
  console.log('WebP-Konvertierung fertig.');
}

convertToWebp();
