import { Prisma } from "@mi_casa/db/client";
import { AppResolvers } from "../types.js";

export const tasksQueryResolver: AppResolvers['Query']['tasks'] = async (_, { filter }, { db }) => {
  const tasks = await db.task.findMany({
    where: {
      status: filter?.status ?? Prisma.skip,
    }
  });
  return tasks;
};

export const taskQueryResolver: AppResolvers['Query']['task'] = async (_, { taskId }, { db }) => {
  const task = await db.task.findUniqueOrThrow({
    where: { id: taskId }
  });

  return task;
};