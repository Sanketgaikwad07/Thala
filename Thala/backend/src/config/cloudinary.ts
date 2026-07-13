import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export async function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey) {
    // No Cloudinary credentials configured (e.g. local/demo mode) - return a mock CDN URL
    // so the rest of the app can function without real credentials.
    return `https://mock-cdn.thala.app/${folder}/${Date.now()}.jpg`;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error);
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}
