import crypto from 'node:crypto';
import { Resolvers } from "@mi_casa/gql"
import { AppContext } from "../context"
import { config } from "../config"


export const resolvers: Resolvers<AppContext> = {
  Query: {
    task(_, { taskId }, { tasks }) {
      const task = tasks.find(t => t.id === taskId);

      if (!task) {
        throw new Error('not found');
      }

      return task;
    },
    tasks(_1, _2, { tasks }) {
      return tasks;
    },
    status() {
      return {
        version: config.VERSION ?? 'unknown'
      }
    }
  },
  Mutation: {
    createTask(_, { input }, { tasks }) {
      const task = { id: crypto.randomUUID(), name: input.name, status: 'READY_TO_BEGIN' as const };
      tasks.push(task);
      return task;
    },
    updateTask(_, { taskId, input }, { tasks }) {
      const task = tasks.find(t => t.id === taskId);

      if (!task) {
        throw new Error('not found');
      }

      task.status = input.status;
      return task;
    },
    deleteTask(_, { taskId }, { tasks }) {
      const taskIndex = tasks.findIndex(t => t.id === taskId);

      if (taskIndex < 0) {
        throw new Error('not found');
      }

      tasks.splice(taskIndex, 1);

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