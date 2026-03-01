import { Prisma } from "@mi_casa/db/client";
import { AppResolvers } from "../types.js";

export const tasksQueryResolver: AppResolvers['Query']['tasks'] = async (_, { filter }, { db, casaId }) => {
  const tasks = await db.task.findMany({
    where: {
      status: filter?.status ?? Prisma.skip,
      equipmentId: filter?.equipmentId ?? Prisma.skip,
      casaId,
    }
  });
  return tasks;
};

export const taskQueryResolver: AppResolvers['Query']['task'] = async (_, { taskId }, { db, casaId }) => {
  const task = await db.task.findUniqueOrThrow({
    where: { id: taskId, casaId }
  });

  return task;
};