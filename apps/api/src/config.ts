import { z } from 'zod';

export const config = z
  .object({
    PORT: z.coerce.number().default(8080),
    DATABASE_URL: z.string(),
    VERSION: z.string().optional(),
    AWS_BUCKET: z.string(),
  })
  .parse(process.env);