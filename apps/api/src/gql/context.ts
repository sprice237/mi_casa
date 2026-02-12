import type { PrismaClient } from '@mi_casa/db/client';
import { RecurringTasksService } from '@mi_casa/domain';
import { config } from "../config.js";

export type Services = {
  recurringTasks: RecurringTasksService
}

export type AppContext = {
  version: string;
  db: PrismaClient;
  services: Services;
}

export const createInitialContext = ({ db }: { db: PrismaClient }): AppContext => ({
  version: config.VERSION ?? 'unknown',
  db,
  services: {
    recurringTasks: new RecurringTasksService(db)
  }
})