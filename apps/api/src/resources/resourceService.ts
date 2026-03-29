import path from 'node:path';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost as awsCreatePresignedPost } from "@aws-sdk/s3-presigned-post";
import { config } from "../config.js";

export type PresignedPost = {
  url: string;
  fields: Record<string, string>
};

export interface ResourceService {
  getResourceUrl(key: string): Promise<string>;
  createPresignedPost(key: string, params: { contentType: string }): Promise<PresignedPost>;
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
      Key: key
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
        ['content-length-range', 1, 10 * 1024 * 1024],
      ],
      Fields: {
        'Content-Type': params.contentType
      }
    });

    return { url, fields }
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
}

export function getResourceService(): ResourceService {
  switch (config.STORAGE_TYPE) {
    case 's3':
      return new S3ResourceService({ bucket: config.STORAGE_S3_BUCKET, s3: new S3Client() });
    case 'local':
      return new LocalResourceService({ localDir: config.STORAGE_LOCAL_DIR, resourceServerUrl: config.STORAGE_RESOURCE_BASE_URL });
  }
}