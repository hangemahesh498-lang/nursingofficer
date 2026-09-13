import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  thumbnail_url: string;
  is_simulated?: boolean;
}

export const CLOUDINARY_FOLDERS = [
  'nursing-officer/questions',
  'nursing-officer/clinical-cases',
  'nursing-officer/instruments',
  'nursing-officer/ecg',
  'nursing-officer/lab-images',
  'nursing-officer/diagrams',
  'nursing-officer/thumbnails'
] as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[number] | string;

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

  if (!isCloudinaryConfigured) {
    // Graceful fallback for preview / development without live Cloudinary keys
    console.info('Cloudinary credentials not set in .env. Falling back to local data URL.');
    return {
      url: fileData.startsWith('data:') ? fileData : `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80`,
      secure_url: fileData.startsWith('data:') ? fileData : `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80`,
      public_id: options.publicId || `local-${Date.now()}`,
      width: 800,
      height: 600,
      format: 'webp',
      bytes: 150000,
      thumbnail_url: fileData.startsWith('data:') ? fileData : `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80`,
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
        { max_width: 1400, crop: 'limit' }, // Preserve ECG and chart legibility
        { quality: 'auto:good' },
        { fetch_format: 'auto' } // Serves WebP / AVIF automatically to supported browsers
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
      is_simulated: false,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload image to Cloudinary CDN');
  }
}

/**
 * Safely deletes an asset from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured || publicId.startsWith('local-')) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}
