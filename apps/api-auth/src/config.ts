import { z } from 'zod';

export const config = z
  .object({
    PORT: z.coerce.number().default(8090),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
  })
  .parse(process.env);