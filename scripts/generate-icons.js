import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const androidResDir = path.resolve(rootDir, 'android/app/src/main/res');

const rootPngPath = path.resolve(rootDir, 'icon.png');
const publicPngPath = path.resolve(publicDir, 'icon.png');
const svgPath = path.resolve(publicDir, 'icon.svg');

// Android mipmap densities and dimensions
const ANDROID_MIPMAPS = [
  { dir: 'mipmap-mdpi', iconSize: 48, foregroundSize: 108 },
  { dir: 'mipmap-hdpi', iconSize: 72, foregroundSize: 162 },
  { dir: 'mipmap-xhdpi', iconSize: 96, foregroundSize: 216 },
  { dir: 'mipmap-xxhdpi', iconSize: 144, foregroundSize: 324 },
  { dir: 'mipmap-xxxhdpi', iconSize: 192, foregroundSize: 432 }
];

// Android splash screens
const ANDROID_SPLASHES = [
  { dir: 'drawable', width: 480, height: 800 },
  { dir: 'drawable-port-mdpi', width: 320, height: 480 },
  { dir: 'drawable-port-hdpi', width: 480, height: 800 },
  { dir: 'drawable-port-xhdpi', width: 720, height: 1280 },
  { dir: 'drawable-port-xxhdpi', width: 960, height: 1600 },
  { dir: 'drawable-port-xxxhdpi', width: 1280, height: 1920 },
  { dir: 'drawable-land-mdpi', width: 480, height: 320 },
  { dir: 'drawable-land-hdpi', width: 800, height: 480 },
  { dir: 'drawable-land-xhdpi', width: 1280, height: 720 },
  { dir: 'drawable-land-xxhdpi', width: 1600, height: 960 },
  { dir: 'drawable-land-xxxhdpi', width: 1920, height: 1280 }
];

async function generate() {
  console.log('🚀 Starting icon generation from icon.png for Web, PWA & Android...');

  // Sync icon.png to public/icon.png
  if (fs.existsSync(rootPngPath)) {
    fs.copyFileSync(rootPngPath, publicPngPath);
    console.log('✓ Synced /icon.png to /public/icon.png');
  }

  const imageSource = fs.existsSync(rootPngPath)
    ? rootPngPath
    : fs.existsSync(publicPngPath)
    ? publicPngPath
    : svgPath;

  if (!fs.existsSync(imageSource)) {
    throw new Error(`Source image not found at ${imageSource}`);
  }

  const imageBuffer = fs.readFileSync(imageSource);

  // 1. Web & PWA Icons in /public
  await sharp(imageBuffer).resize(192, 192).png().toFile(path.resolve(publicDir, 'pwa-192x192.png'));
  console.log('✓ Generated public/pwa-192x192.png');

  await sharp(imageBuffer).resize(512, 512).png().toFile(path.resolve(publicDir, 'pwa-512x512.png'));
  console.log('✓ Generated public/pwa-512x512.png');

  await sharp(imageBuffer).resize(180, 180).png().toFile(path.resolve(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Generated public/apple-touch-icon.png');

  // PWA Maskable 512x512 with safe padding & matching teal background
  await sharp(imageBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 15, g: 118, b: 110, alpha: 1 } // #0f766e
    })
    .png()
    .toFile(path.resolve(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ Generated public/pwa-maskable-512x512.png');

  // 2. Android App Mipmap Launcher Icons
  if (fs.existsSync(androidResDir)) {
    console.log('📱 Generating Android launcher mipmap densities in android/app/src/main/res/ ...');

    for (const mipmap of ANDROID_MIPMAPS) {
      const targetDir = path.resolve(androidResDir, mipmap.dir);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Standard launcher icon (e.g. 48x48, 72x72, 96x96, 144x144, 192x192)
      await sharp(imageBuffer)
        .resize(mipmap.iconSize, mipmap.iconSize)
        .png()
        .toFile(path.resolve(targetDir, 'ic_launcher.png'));

      // Round launcher icon
      await sharp(imageBuffer)
        .resize(mipmap.iconSize, mipmap.iconSize)
        .png()
        .toFile(path.resolve(targetDir, 'ic_launcher_round.png'));

      // Adaptive foreground icon (e.g. 108x108, 162x162, 216x216, 324x324, 432x432)
      // We scale the logo to ~70% inside the foreground canvas so it fits inside the safe zone circle
      const innerSize = Math.round(mipmap.foregroundSize * 0.72);
      const padding = Math.round((mipmap.foregroundSize - innerSize) / 2);

      await sharp(imageBuffer)
        .resize(innerSize, innerSize)
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent foreground
        })
        .png()
        .toFile(path.resolve(targetDir, 'ic_launcher_foreground.png'));

      console.log(`✓ Generated ${mipmap.dir}/ (ic_launcher.png, ic_launcher_round.png, ic_launcher_foreground.png)`);
    }

    // Ensure adaptive icon XMLs exist in mipmap-anydpi-v26
    const anyDpiDir = path.resolve(androidResDir, 'mipmap-anydpi-v26');
    if (!fs.existsSync(anyDpiDir)) {
      fs.mkdirSync(anyDpiDir, { recursive: true });
    }

    const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
    fs.writeFileSync(path.resolve(anyDpiDir, 'ic_launcher.xml'), adaptiveXml);
    fs.writeFileSync(path.resolve(anyDpiDir, 'ic_launcher_round.xml'), adaptiveXml);
    console.log('✓ Verified adaptive icon XMLs in mipmap-anydpi-v26/');

    // Ensure values/ic_launcher_background.xml has white background
    const valuesDir = path.resolve(androidResDir, 'values');
    if (!fs.existsSync(valuesDir)) {
      fs.mkdirSync(valuesDir, { recursive: true });
    }
    const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>
`;
    fs.writeFileSync(path.resolve(valuesDir, 'ic_launcher_background.xml'), bgXml);

    // 3. Android Splash Screens
    console.log('🖼️ Generating Android splash screens...');
    for (const splash of ANDROID_SPLASHES) {
      const splashDir = path.resolve(androidResDir, splash.dir);
      if (!fs.existsSync(splashDir)) {
        fs.mkdirSync(splashDir, { recursive: true });
      }

      // Center the logo nicely on the white splash canvas
      const logoMaxDim = Math.min(splash.width, splash.height);
      const logoSize = Math.round(logoMaxDim * 0.45);
      const resizedLogo = await sharp(imageBuffer).resize(logoSize, logoSize, { fit: 'contain' }).png().toBuffer();

      await sharp({
        create: {
          width: splash.width,
          height: splash.height,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .composite([{ input: resizedLogo, gravity: 'center' }])
        .png()
        .toFile(path.resolve(splashDir, 'splash.png'));

      console.log(`✓ Generated ${splash.dir}/splash.png (${splash.width}x${splash.height})`);
    }
  }

  console.log('🎉 All Web, PWA, and Android launcher assets generated successfully!');
}

generate().catch(err => {
  console.error('❌ Error generating launcher assets:', err);
  process.exit(1);
});
