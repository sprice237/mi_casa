import { create } from 'zustand';
import path from 'node:path';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost as awsCreatePresignedPost } from "@aws-sdk/s3-presigned-post";
import { config } from "../config.js";
import { getImageInfo, resizeImage } from '@mi_casa/domain';
import fs from 'fs/promises';
import { Readable } from 'node:stream';

export type PresignedPost = {
  url: string;
  fields: Record<string, string>
};

export interface ResourceService {
  getResourceUrl(key: string): Promise<string>;
  createPresignedPost(key: string, params: { contentType: string }): Promise<PresignedPost>;
  createThumbnail(key: string): Promise<{ thumbnailKey: string; mimeType: string }>;
}

export class S3ResourceService implements ResourceService {
  public readonly bucket: string;
  public readonly s3: S3Client;

  constructor({ bucket, s3 }: { bucket: string, s3: S3Client }) {
    this.bucket = bucket;
    this.s3 = s3;
  }

  async getResourceUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const url = await getSignedUrl(this.s3, command);
    return url;
  }

  async createPresignedPost(key: string, params: { contentType: string; }): Promise<PresignedPost> {
    const { url, fields } = await awsCreatePresignedPost(this.s3, {
      Bucket: this.bucket,
      Key: key,
      Conditions: [
        ['eq', '$Content-Type', params.contentType],
        ['content-length-range', 1, config.MAX_ATTACHMENT_SIZE_BYTES],
      ],
      Fields: {
        'Content-Type': params.contentType
      }
    });

    return { url, fields }
  }

  async createThumbnail(key: string): Promise<{ thumbnailKey: string; mimeType: string }> {
    console.log(`retrieving object from s3 from bucket ${this.bucket} with key ${key} to create thumbnail`);
    const downloadCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    })

    const response = await this.s3.send(downloadCommand);

    if (!response.Body) {
      throw new Error('unable to get image from s3');
    }

    const imageBuffer = Buffer.from(await response.Body.transformToByteArray());

    const { width, height } = await getImageInfo(imageBuffer);

    const thumbnailWidth = 540;
    const thumbnailHeight = Math.ceil((thumbnailWidth / width) * height);
    const thumbnailImageBuffer = await resizeImage({ imageBuffer, width: thumbnailWidth, height: thumbnailHeight, format: 'webp' });

    const thumbnailKey = `${key}_thumbnail`;

    console.log(`uploading thumbnail to s3 bucket ${this.bucket} with key ${thumbnailKey}`);
    const uploadCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: thumbnailKey,
      Body: Readable.from(thumbnailImageBuffer.data),
      ContentType: thumbnailImageBuffer.mimeType,
      ContentLength: thumbnailImageBuffer.data.length,
    });

    await this.s3.send(uploadCommand);

    return { thumbnailKey, mimeType: thumbnailImageBuffer.mimeType }

  }
}

export class LocalResourceService implements ResourceService {
  public readonly localDir: string;
  public readonly resourceServerUrl: string;

  constructor({ localDir, resourceServerUrl }: { localDir: string, resourceServerUrl: string }) {
    this.localDir = localDir;
    this.resourceServerUrl = resourceServerUrl;
  }

  async getResourceUrl(key: string): Promise<string> {
    const urlRoute = path.normalize(`/${key}`);
    return `${this.resourceServerUrl}${urlRoute}`;
  }

  async createPresignedPost(key: string, params: { contentType: string; }): Promise<PresignedPost> {
    const urlRoute = path.normalize(`/${key}`);
    const url = `${this.resourceServerUrl}${urlRoute}`;

    return { url, fields: {} }
  }

  async createThumbnail(key: string): Promise<{ thumbnailKey: string; mimeType: string }> {
    const localPath = path.join(this.localDir, path.normalize(`/${key}`));
    const imageBuffer = await fs.readFile(localPath);
    const { width, height } = await getImageInfo(imageBuffer);

    const thumbnailWidth = 540;
    const thumbnailHeight = Math.ceil((thumbnailWidth / width) * height);
    const thumbnailImageBuffer = await resizeImage({ imageBuffer, width: thumbnailWidth, height: thumbnailHeight, format: 'webp' });

    const thumbnailKey = `${key}_thumbnail`;

    await fs.writeFile(path.join(this.localDir, path.normalize(`/${thumbnailKey}`)), thumbnailImageBuffer.data);
    return { thumbnailKey, mimeType: thumbnailImageBuffer.mimeType };
  }
}

export function getResourceService(): ResourceService {
  switch (config.STORAGE_TYPE) {
    case 's3':
      return new S3ResourceService({
        bucket: config.STORAGE_S3_BUCKET, s3: new S3Client({
          region: config.STORAGE_S3_AWS_REGION,
          credentials: {
            accessKeyId: config.STORAGE_S3_AWS_ACCESS_KEY_ID,
            secretAccessKey: config.STORAGE_S3_AWS_SECRET_ACCESS_KEY
          }
        })
      });
    case 'local':
      return new LocalResourceService({ localDir: config.STORAGE_LOCAL_DIR, resourceServerUrl: config.STORAGE_RESOURCE_BASE_URL });
  }
}