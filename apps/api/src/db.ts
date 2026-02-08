import { PrismaClient } from '@mi_casa/db/client';
import { PrismaPg } from '@mi_casa/db/adapter';
import { config } from './config';

export function createPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl })
  });
}

export const db = createPrismaClient(config.DATABASE_URL);