import sharp, { FormatEnum } from 'sharp';

export async function getImageInfo(imageBuffer: Buffer): Promise<{ width: number; height: number; format: string }> {
  const metadata = await sharp(imageBuffer).metadata();

  if (!metadata.width || !metadata.height || !metadata.format) {
    throw new Error('unable to get image metadata');
  }

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format
  };
}

export async function resizeImage({ imageBuffer, width, height, format }: { imageBuffer: Buffer, width: number, height: number, format: keyof FormatEnum }): Promise<{ data: Buffer; mimeType: string }> {
  const { data, info } = await sharp(imageBuffer)
    .resize(width, height)
    .toFormat(format)
    .toBuffer({ resolveWithObject: true });

  return {
    data,
    mimeType: `image/${info.format}`
  };
}
