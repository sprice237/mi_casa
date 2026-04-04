import { z } from 'zod';

export const config = z
  .object({
    DATABASE_URL: z.string(),
    REDIS_URL: z.string(),
  })
  .parse(process.env);