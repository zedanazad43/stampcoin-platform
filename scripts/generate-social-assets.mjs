import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = process.cwd();
const srcSvg = path.join(root, 'client', 'public', 'logo.svg');
const outDir = path.join(root, 'assets', 'social');

async function run() {
  try {
    if (!fs.existsSync(srcSvg)) {
      console.error('logo.svg not found at', srcSvg);
      process.exit(0);
    }
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const sizes = [128, 256, 400, 512, 1024];
    for (const size of sizes) {
      const out = path.join(outDir, `logo-${size}.png`);
      await sharp(srcSvg).resize(size, size).png().toFile(out);
      console.log('Generated', out);
    }
  } catch (e) {
    console.error('Asset generation failed:', e);
    process.exitCode = 0;
  }
}

run();
