import type { PrismaClient } from '@mi_casa/db/client';
import { RecurringTasksService, TasksService } from '@mi_casa/domain';
import { config } from "../config.js";
import { AppJwt, AppJwtSchema } from '@mi_casa/common';
import { GraphQLError } from 'graphql';
import { getResourceService, ResourceService } from '../resources/resourceService.js';

export type Services = {
  recurringTasks: RecurringTasksService
  resourceService: ResourceService
  tasks: TasksService
}

export interface AppContext {
  readonly version: string;
  readonly db: PrismaClient;
  readonly services: Services;
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
      resourceService: getResourceService(),
      recurringTasks: new RecurringTasksService(db),
      tasks: new TasksService(db)
    },
    _jwt,
    jwt,
    casaId: jwt.casaId
  })
} 