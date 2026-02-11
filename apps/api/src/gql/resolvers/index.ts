import { statusQueryResolver, statusTypeResolver } from "./status";
import { createTaskMutationResolver, deleteTaskMutationResolver, taskQueryResolver, tasksQueryResolver, taskTypeResolver, updateTaskMutationResolver } from "./tasks";
import { AppResolvers } from './types';
import { createRecurringTaskMutationResolver, deleteRecurringTaskMutationResolver, recurringTaskProjectionsQueryResolver, recurringTaskProjectionTypeResolver, recurringTaskQueryResolver, recurringTasksQueryResolver, recurringTaskTypeResolver, updateRecurringTaskMutationResolver } from "./recurringTasks";
import { scalars } from "@mi_casa/gql";


export const resolvers: AppResolvers = {
  Query: {
    recurringTasks: recurringTasksQueryResolver,
    recurringTask: recurringTaskQueryResolver,
    recurringTaskProjections: recurringTaskProjectionsQueryResolver,
    tasks: tasksQueryResolver,
    task: taskQueryResolver,
    status: statusQueryResolver,
  },
  Mutation: {
    createRecurringTask: createRecurringTaskMutationResolver,
    updateRecurringTask: updateRecurringTaskMutationResolver,
    deleteRecurringTask: deleteRecurringTaskMutationResolver,
    createTask: createTaskMutationResolver,
    updateTask: updateTaskMutationResolver,
    deleteTask: deleteTaskMutationResolver,
  },

  Status: statusTypeResolver,
  RecurringTask: recurringTaskTypeResolver,
  RecurringTaskProjection: recurringTaskProjectionTypeResolver,
  Task: taskTypeResolver,

  ...scalars,
}