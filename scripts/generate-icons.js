import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const rootPngPath = path.resolve(__dirname, '../icon.png');
const publicPngPath = path.resolve(publicDir, 'icon.png');
const svgPath = path.resolve(publicDir, 'icon.svg');

async function generate() {
  console.log('Generating launcher icon assets from icon.png...');
  
  // Copy root icon.png to public/icon.png if it exists
  if (fs.existsSync(rootPngPath)) {
    fs.copyFileSync(rootPngPath, publicPngPath);
    console.log('✓ Copied /icon.png to /public/icon.png');
  }

  const imageSource = fs.existsSync(publicPngPath) ? publicPngPath : svgPath;
  const imageBuffer = fs.readFileSync(imageSource);

  // 192x192 PNG
  await sharp(imageBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-192x192.png'));
  console.log('✓ Created pwa-192x192.png');

  // 512x512 PNG
  await sharp(imageBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-512x512.png'));
  console.log('✓ Created pwa-512x512.png');

  // Apple Touch Icon 180x180 PNG
  await sharp(imageBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Created apple-touch-icon.png');

  // Maskable 512x512 with safe padding
  await sharp(imageBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 15, g: 118, b: 110, alpha: 1 } // deep teal #0f766e
    })
    .png()
    .toFile(path.resolve(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ Created pwa-maskable-512x512.png');

  console.log('All launcher icons generated successfully!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
