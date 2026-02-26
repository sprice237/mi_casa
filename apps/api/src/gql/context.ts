import type { PrismaClient } from '@mi_casa/db/client';
import { RecurringTasksService } from '@mi_casa/domain';
import { config } from "../config.js";
import { S3Client } from '@aws-sdk/client-s3';

export type Services = {
  recurringTasks: RecurringTasksService
}

export type AppContext = {
  version: string;
  db: PrismaClient;
  services: Services;
  s3: S3Client;
}

export const createInitialContext = ({ db }: { db: PrismaClient }): AppContext => ({
  version: config.VERSION ?? 'unknown',
  db,
  services: {
    recurringTasks: new RecurringTasksService(db)
  },
  s3: new S3Client(),
})