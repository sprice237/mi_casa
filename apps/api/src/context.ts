import type { PrismaClient } from '@mi_casa/db/client';
import { config } from "./config";

export type AppContext = {
  version: string;
  db: PrismaClient;
}

export const createInitialContext = (db: PrismaClient): AppContext => ({
  version: config.VERSION ?? 'unknown',
  db,
})