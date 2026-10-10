import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// User-provided Cloudinary credentials with env override
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'sjgixi4c';
const apiKey = process.env.CLOUDINARY_API_KEY || '286384694322121';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'L2ufniVOp6mfTzRuybLsqOt7_tg';

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

// Ensure public/uploads directory exists for reliable fallback
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {}

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  thumbnail_url: string;
  resource_type?: string;
  duration?: number;
  is_simulated?: boolean;
}

export const CLOUDINARY_FOLDERS = [
  'nursing-officer/questions',
  'nursing-officer/clinical-cases',
  'nursing-officer/instruments',
  'nursing-officer/ecg',
  'nursing-officer/lab-images',
  'nursing-officer/diagrams',
  'nursing-officer/thumbnails',
  'nursing-officer/promo-videos',
  'nursing-officer/ads'
] as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[number] | string;

/**
 * Saves base64 image data locally to public/uploads
 */
function saveBase64Locally(base64Data: string, prefix = 'img'): { url: string; public_id: string; format: string; bytes: number } | null {
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;

    const mime = matches[1];
    const ext = mime.includes('png') ? 'png' : mime.includes('gif') ? 'gif' : mime.includes('webp') ? 'webp' : 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);

    return {
      url: `/uploads/${filename}`,
      public_id: `local-${filename}`,
      format: ext,
      bytes: buffer.length
    };
  } catch (err) {
    return null;
  }
}

/**
 * Uploads an image to Cloudinary with automatic optimization (WebP, quality auto)
 * Preserves high clarity for ECG, instrument, and lab images while keeping size 100-300KB.
 */
export async function uploadToCloudinary(
  fileData: string, // Base64 or URL
  options: {
    folder?: CloudinaryFolder;
    publicId?: string;
    altText?: string;
    tags?: string[];
  } = {}
): Promise<CloudinaryUploadResult> {
  const targetFolder = options.folder || 'nursing-officer/questions';

  if (!fileData || typeof fileData !== 'string') {
    const fallbackUrl = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
    return {
      url: fallbackUrl,
      secure_url: fallbackUrl,
      public_id: options.publicId || `local-${Date.now()}`,
      width: 800,
      height: 600,
      format: 'jpg',
      bytes: 150000,
      thumbnail_url: fallbackUrl,
      is_simulated: true,
    };
  }

  if (!isCloudinaryConfigured) {
    const localSave = fileData.startsWith('data:') ? saveBase64Locally(fileData, 'q') : null;
    const resolvedUrl = localSave ? localSave.url : (fileData.startsWith('http') ? fileData : 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80');

    return {
      url: resolvedUrl,
      secure_url: resolvedUrl,
      public_id: options.publicId || (localSave ? localSave.public_id : `local-${Date.now()}`),
      width: 800,
      height: 600,
      format: localSave ? localSave.format : 'webp',
      bytes: localSave ? localSave.bytes : 150000,
      thumbnail_url: resolvedUrl,
      is_simulated: true,
    };
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: targetFolder,
      public_id: options.publicId,
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { max_width: 1400, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      tags: ['nursing-officer-prep', ...(options.tags || [])],
    });

    const thumbnailUrl = cloudinary.url(uploadResponse.public_id, {
      width: 320,
      height: 220,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    });

    return {
      url: uploadResponse.url,
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
      thumbnail_url: thumbnailUrl,
      resource_type: 'image',
      is_simulated: false,
    };
  } catch (error: any) {
    console.warn('Cloudinary upload fallback activated due to:', error?.message || error);

    // Fallback 1: If base64, save locally to public/uploads
    if (fileData.startsWith('data:')) {
      const local = saveBase64Locally(fileData, 'media');
      if (local) {
        return {
          url: local.url,
          secure_url: local.url,
          public_id: local.public_id,
          width: 800,
          height: 600,
          format: local.format,
          bytes: local.bytes,
          thumbnail_url: local.url,
          resource_type: 'image',
          is_simulated: true,
        };
      }
    }

    // Fallback 2: If it is an external URL, use it directly
    if (fileData.startsWith('http')) {
      return {
        url: fileData,
        secure_url: fileData,
        public_id: options.publicId || `ext-${Date.now()}`,
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: 120000,
        thumbnail_url: fileData,
        resource_type: 'image',
        is_simulated: true,
      };
    }

    // Fallback 3: Standard medical photo
    const defaultUrl = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
    return {
      url: defaultUrl,
      secure_url: defaultUrl,
      public_id: `fallback-${Date.now()}`,
      width: 800,
      height: 600,
      format: 'jpg',
      bytes: 150000,
      thumbnail_url: defaultUrl,
      resource_type: 'image',
      is_simulated: true,
    };
  }
}

/**
 * Uploads a video (16:9 widescreen or 9:16 vertical reel) to Cloudinary
 */
export async function uploadVideoToCloudinary(
  fileData: string, // Base64, blob data url, or direct link
  options: {
    folder?: CloudinaryFolder;
    publicId?: string;
    aspectRatio?: '16:9' | '9:16';
    tags?: string[];
  } = {}
): Promise<CloudinaryUploadResult> {
  const targetFolder = options.folder || 'nursing-officer/promo-videos';

  if (!isCloudinaryConfigured) {
    console.info('Cloudinary credentials not set. Falling back to sample video.');
    const fallbackUrl = options.aspectRatio === '9:16'
      ? 'https://res.cloudinary.com/demo/video/upload/c_fill,ar_9:16,w_720/dog.mp4'
      : 'https://res.cloudinary.com/demo/video/upload/c_scale,w_854/sea_turtle.mp4';
    return {
      url: fallbackUrl,
      secure_url: fallbackUrl,
      public_id: options.publicId || `local-vid-${Date.now()}`,
      width: options.aspectRatio === '9:16' ? 720 : 1280,
      height: options.aspectRatio === '9:16' ? 1280 : 720,
      format: 'mp4',
      bytes: 2500000,
      thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      resource_type: 'video',
      duration: 15,
      is_simulated: true
    };
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: targetFolder,
      public_id: options.publicId,
      resource_type: 'video',
      overwrite: true,
      tags: ['nursing-officer-ads', ...(options.tags || [])]
    });

    const thumbnailUrl = cloudinary.url(uploadResponse.public_id, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { width: options.aspectRatio === '9:16' ? 360 : 640, crop: 'scale' },
        { start_offset: '1' }
      ]
    });

    return {
      url: uploadResponse.url,
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
      thumbnail_url: thumbnailUrl || uploadResponse.secure_url,
      resource_type: 'video',
      duration: uploadResponse.duration,
      is_simulated: false
    };
  } catch (error: any) {
    console.error('Cloudinary video upload error:', error);
    throw new Error(error.message || 'Failed to upload video to Cloudinary CDN');
  }
}

/**
 * Safely deletes an asset from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<boolean> {
  if (!isCloudinaryConfigured || publicId.startsWith('local-')) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}
