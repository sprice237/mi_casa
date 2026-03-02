import { AppResolvers } from "../types.js";

export const tasksQueryResolver: AppResolvers['Query']['tasks'] = async (_, { filter }, { services, casaId }) => {
  const tasks = await services.tasks.findMany({
    where: {
      status: filter?.status ?? undefined,
      equipmentId: filter?.equipmentId ?? undefined,
    },
    tenant: {
      casaId
    }
  });
  return tasks;
};

export const taskQueryResolver: AppResolvers['Query']['task'] = async (_, { taskId }, { services, casaId }) => {
  const task = await services.tasks.findUnique({
    where: { id: taskId },
    tenant: {
      casaId
    }
  });

  return task;
};