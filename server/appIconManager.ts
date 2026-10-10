import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { db } from './db.ts';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DIST_DIR = path.join(process.cwd(), 'dist');

export interface AppIconUpdateResult {
  success: boolean;
  message: string;
  icon_url: string;
  updated_files: string[];
  timestamp: string;
  error?: string;
}

/**
 * Saves and propagates new app icon across all PWA, web, and native Android launcher icon paths
 */
export async function updateAppIcon(
  buffer: Buffer,
  mimeType: string = 'image/png',
  actorName: string = 'Admin'
): Promise<AppIconUpdateResult> {
  const timestamp = Date.now();
  const iconUrl = `/icon.png?v=${timestamp}`;
  const updatedFiles: string[] = [];

  try {
    const mainIconPath = path.join(PUBLIC_DIR, 'icon.png');

    // 1. Write main icon to public directory
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    fs.writeFileSync(mainIconPath, buffer);
    updatedFiles.push('public/icon.png');

    // 2. Generate Web & PWA Icons with ImageMagick
    const webConfigs = [
      { file: 'public/pwa-192x192.png', size: 192 },
      { file: 'public/pwa-512x512.png', size: 512 },
      { file: 'public/pwa-maskable-512x512.png', size: 512 },
      { file: 'public/apple-touch-icon.png', size: 180 },
      { file: 'public/favicon.ico', size: 48 }
    ];

    for (const { file, size } of webConfigs) {
      try {
        execSync(`convert "${mainIconPath}" -resize ${size}x${size} "${path.join(process.cwd(), file)}"`);
        updatedFiles.push(file);
      } catch (e) {
        fs.writeFileSync(path.join(process.cwd(), file), buffer);
        updatedFiles.push(file);
      }
    }

    // 3. Generate Native Android Launcher Mipmaps
    const androidConfigs = [
      { dir: 'android/app/src/main/res/mipmap-mdpi', size: 48, fgSize: 108 },
      { dir: 'android/app/src/main/res/mipmap-hdpi', size: 72, fgSize: 162 },
      { dir: 'android/app/src/main/res/mipmap-xhdpi', size: 96, fgSize: 216 },
      { dir: 'android/app/src/main/res/mipmap-xxhdpi', size: 144, fgSize: 324 },
      { dir: 'android/app/src/main/res/mipmap-xxxhdpi', size: 192, fgSize: 432 }
    ];

    for (const { dir, size, fgSize } of androidConfigs) {
      const fullDir = path.join(process.cwd(), dir);
      if (fs.existsSync(fullDir)) {
        try {
          execSync(`convert "${mainIconPath}" -resize ${size}x${size} "${path.join(fullDir, 'ic_launcher.png')}"`);
          execSync(`convert "${mainIconPath}" -resize ${size}x${size} "${path.join(fullDir, 'ic_launcher_round.png')}"`);
          execSync(`convert "${mainIconPath}" -resize ${fgSize}x${fgSize} "${path.join(fullDir, 'ic_launcher_foreground.png')}"`);
          updatedFiles.push(`${dir}/ic_launcher.png`);
        } catch (e) {}
      }
    }

    // 4. Also sync to dist directory if built
    if (fs.existsSync(DIST_DIR)) {
      for (const { file } of webConfigs) {
        const distFile = file.replace('public/', 'dist/');
        if (fs.existsSync(path.dirname(distFile))) {
          try {
            fs.copyFileSync(path.join(process.cwd(), file), path.join(process.cwd(), distFile));
            updatedFiles.push(distFile);
          } catch (e) {}
        }
      }
      try {
        fs.copyFileSync(mainIconPath, path.join(DIST_DIR, 'icon.png'));
        updatedFiles.push('dist/icon.png');
      } catch (e) {}
    }

    // 5. Update System Settings in database
    db.updateSettings({
      app_icon_url: iconUrl
    } as any);

    return {
      success: true,
      message: 'अ‍ॅप आयकॉन सर्वत्र (Android Launcher Mipmaps + PWA + Header) यशस्वीरित्या अपडेट झाला आहे!',
      icon_url: iconUrl,
      updated_files: updatedFiles,
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    console.error('App Icon save error:', err);
    return {
      success: false,
      message: `आयकॉन सेव्ह करताना त्रुटी आली: ${err.message}`,
      icon_url: '/icon.png',
      updated_files: [],
      timestamp: new Date().toISOString(),
      error: err.message
    };
  }
}
