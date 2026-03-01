import { Prisma } from "@mi_casa/db/client";
import { AppResolvers } from "../types.js";

export const recurringTasksQueryResolver: AppResolvers['Query']['recurringTasks'] = async (_, { filter }, { services, casaId }) => {
  const recurringTasks = await services.recurringTasks.findMany({
    where: {
      equipmentId: filter?.equipmentId ?? Prisma.skip,
      casaId
    }
  });
  return recurringTasks;
};

export const recurringTaskQueryResolver: AppResolvers['Query']['recurringTask'] = async (_, { recurringTaskId }, { services, casaId }) => {
  const recurringTask = await services.recurringTasks.findUniqueOrThrow({
    where: { id: recurringTaskId, casaId }
  });

  return recurringTask;
};

export const recurringTaskProjectionsQueryResolver: AppResolvers['Query']['recurringTaskProjections'] = async (_1, { input: { recurringTaskIds, startDate, endDate, limit } }, { services, casaId }) => {
  const recurringTaskProjections = await services.recurringTasks.getProjections({
    where: {
      ...(recurringTaskIds ? { id: { in: recurringTaskIds } } : {}),
      casaId,
    },
    startDate,
    endDate: endDate ?? undefined,
    limit
  });

  const recurringTaskProjectionsWithIds = recurringTaskProjections.map(projection => ({
    ...projection,
    id: `${projection.recurringTask.id}-${projection.date.toISOString().split('T')[0]}`
  }));
  return recurringTaskProjectionsWithIds;
};
