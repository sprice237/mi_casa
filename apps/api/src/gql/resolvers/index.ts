import { statusQueryResolver, statusTypeResolver } from "./status";
import { createTaskMutationResolver, deleteTaskMutationResolver, taskQueryResolver, tasksQueryResolver, taskTypeResolver, updateTaskMutationResolver } from "./tasks";
import { AppResolvers } from './types';
import { scalars } from "@mi_casa/gql";


export const resolvers: AppResolvers = {
  Query: {
    tasks: tasksQueryResolver,
    task: taskQueryResolver,
    status: statusQueryResolver,
  },
  Mutation: {
    createTask: createTaskMutationResolver,
    updateTask: updateTaskMutationResolver,
    deleteTask: deleteTaskMutationResolver,
  },
  Status: statusTypeResolver,
  Task: taskTypeResolver,

  ...scalars,
}