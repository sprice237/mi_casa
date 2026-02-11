import { RecurringTaskRuleSchema } from "@mi_casa/common";
import { AppResolvers } from "../types";

export const createRecurringTaskMutationResolver: AppResolvers['Mutation']['createRecurringTask'] = async (_, { input }, { services }) => {
  const rule = RecurringTaskRuleSchema.parse(input.rule);
  const recurringTasks = await services.recurringTasks.create({
    data: {
      ...input,
      rule
    }
  });
  return recurringTasks;
};

export const updateRecurringTaskMutationResolver: AppResolvers['Mutation']['updateRecurringTask'] = async (_, { recurringTaskId, input }, { services }) => {
  const rule = input.rule ? RecurringTaskRuleSchema.parse(input.rule) : undefined;

  const recurringTask = await services.recurringTasks.update({
    where: { id: recurringTaskId },
    data: {
      name: input.name ?? undefined,
      rule,
      startDate: input.startDate ?? undefined,
    }
  });

  return recurringTask;
};

export const deleteRecurringTaskMutationResolver: AppResolvers['Mutation']['deleteRecurringTask'] = async (_, { recurringTaskId }, { services }) => {
  await services.recurringTasks.delete({
    where: { id: recurringTaskId },
  });

  return true;
};