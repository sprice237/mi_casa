import { Prisma } from "@mi_casa/db/client";
import { AppResolvers } from "../types.js";

export const recurringTasksQueryResolver: AppResolvers['Query']['recurringTasks'] = async (_1, _2, { services }) => {
  const recurringTasks = await services.recurringTasks.findMany();
  return recurringTasks;
};

export const recurringTaskQueryResolver: AppResolvers['Query']['recurringTask'] = async (_, { recurringTaskId }, { services }) => {
  const recurringTask = await services.recurringTasks.findUniqueOrThrow({
    where: { id: recurringTaskId }
  });

  return recurringTask;
};

export const recurringTaskProjectionsQueryResolver: AppResolvers['Query']['recurringTaskProjections'] = async (_1, { input: { recurringTaskIds, startDate, endDate } }, { services }) => {
  const recurringTaskProjections = await services.recurringTasks.getProjections({ where: recurringTaskIds ? { id: { in: recurringTaskIds } } : undefined, startDate, endDate });
  const recurringTaskProjectionsWithIds = recurringTaskProjections.map(projection => ({
    ...projection,
    id: `${projection.recurringTask.id}-${projection.date.toISOString().split('T')[0]}`
  }));
  return recurringTaskProjectionsWithIds;
};
