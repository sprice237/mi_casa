import { Prisma } from "@mi_casa/db/client";
import { AppResolvers } from "../types.js";

export const createTaskMutationResolver: AppResolvers['Mutation']['createTask'] = async (_, { input }, { db }) => {
  const task = await db.task.create({
    data: {
      name: input.name,
      status: 'READY_TO_BEGIN',
      equipmentId: input.equipmentId,
      projectId: input.projectId,
    }
  });

  return task;
};

export const updateTaskMutationResolver: AppResolvers['Mutation']['updateTask'] = async (_, { taskId, input }, { db }) => {
  const task = await db.task.update({
    where: { id: taskId },
    data: {
      name: input.name !== null ? input.name : Prisma.skip,
      status: input.status !== null ? input.status : Prisma.skip,
      equipmentId: input.equipmentId ? input.equipmentId.id : Prisma.skip,
      projectId: input.projectId ? input.projectId.id : Prisma.skip,
    }
  });

  return task;
};

export const deleteTaskMutationResolver: AppResolvers['Mutation']['deleteTask'] = async (_, { taskId }, { db }) => {
  await db.task.delete({
    where: { id: taskId },
  });

  return true;
};