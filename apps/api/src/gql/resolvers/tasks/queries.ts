import { AppResolvers } from "../types";

export const tasksQueryResolver: AppResolvers['Query']['tasks'] = async (_1, _2, { db }) => {
  const tasks = await db.task.findMany();
  return tasks;
};

export const taskQueryResolver: AppResolvers['Query']['task'] = async (_, { taskId }, { db }) => {
  const task = await db.task.findUniqueOrThrow({
    where: { id: taskId }
  });

  return task;
};