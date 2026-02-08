import crypto from 'node:crypto';
import { Resolvers } from "@mi_casa/gql"
import { AppContext } from "../context"
import { config } from "../config"


export const resolvers: Resolvers<AppContext> = {
  Query: {
    async task(_, { taskId }, { db }) {
      const task = await db.task.findUniqueOrThrow({
        where: { id: taskId }
      });

      return task;
    },
    async tasks(_1, _2, { db }) {
      const tasks = await db.task.findMany();
      return tasks;
    },
    status() {
      return {
        version: config.VERSION ?? 'unknown'
      }
    }
  },
  Mutation: {
    async createTask(_, { input }, { db }) {
      const task = await db.task.create({
        data: {
          name: input.name,
          status: 'READY_TO_BEGIN'
        }
      });

      return task;
    },
    async updateTask(_, { taskId, input }, { db }) {
      const task = await db.task.update({
        where: { id: taskId },
        data: {
          name: input.name !== null ? input.name : undefined,
          status: input.status !== null ? input.status : undefined,
        }
      });

      return task;
    },
    async deleteTask(_, { taskId }, { db }) {
      await db.task.delete({
        where: { id: taskId },
      });

      return true;
    },
  },
  Status: {
    version: (parent) => parent.version
  },
  Task: {
    id: (root) => root.id,
    name: (root) => root.name,
    status: (root) => root.status,
  }
}