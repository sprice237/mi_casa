import type { PrismaClient } from '@mi_casa/db/client';
import { RecurringTasksService, TasksService } from '@mi_casa/domain';
import { config } from "../config.js";
import { S3Client } from '@aws-sdk/client-s3';
import { AppJwt, AppJwtSchema } from '@mi_casa/common';
import { GraphQLError } from 'graphql';

export type Services = {
  recurringTasks: RecurringTasksService
  tasks: TasksService
}

export interface AppContext {
  readonly version: string;
  readonly db: PrismaClient;
  readonly services: Services;
  readonly s3: S3Client;
  readonly jwt: AppJwt;
  readonly _jwt: any;
  readonly casaId: string;
}


export const createContext = ({ db, _jwt }: { db: PrismaClient, _jwt: any }): AppContext => {
  let jwt: AppJwt;

  try {
    jwt = AppJwtSchema.parse(_jwt.payload);
  } catch (e) {
    throw new GraphQLError('Unauthenticated', {
      extensions: {
        http: {
          status: 401
        }
      },
    });
  }

  return ({
    version: config.VERSION ?? 'unknown',
    db,
    services: {
      recurringTasks: new RecurringTasksService(db),
      tasks: new TasksService(db)
    },
    s3: new S3Client(),
    _jwt,
    jwt,
    casaId: jwt.casaId
  })
} 