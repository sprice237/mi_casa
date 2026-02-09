import { Prisma } from "@mi_casa/db/client";
import { AppResolvers } from "../types";

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