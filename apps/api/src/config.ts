import { z } from 'zod';

export const config = z
  .intersection(
    z.object({
      PORT: z.coerce.number().default(8080),
      DATABASE_URL: z.string(),
      VERSION: z.string().optional(),
      JWT_SECRET: z.string(),
      MAX_ATTACHMENT_SIZE_BYTES: z.coerce.number().default(15 * 1024 * 1024),
    }),
    z.discriminatedUnion('STORAGE_TYPE', [
      z.object({
        STORAGE_TYPE: z.literal('s3'),
        STORAGE_S3_BUCKET: z.string(),
      }),
      z.object({
        STORAGE_TYPE: z.literal('local'),
        STORAGE_LOCAL_DIR: z.string(),
        STORAGE_RESOURCE_BASE_URL: z.string(),
      })
    ])
  )
  .parse(process.env);