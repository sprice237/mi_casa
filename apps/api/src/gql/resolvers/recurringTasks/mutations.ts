import { RecurringTaskRuleSchema } from "@mi_casa/common";
import { AppResolvers } from "../types.js";

export const createRecurringTaskMutationResolver: AppResolvers['Mutation']['createRecurringTask'] = async (_, { input }, { services, casaId }) => {
  const rule = RecurringTaskRuleSchema.parse(input.rule);
  const recurringTasks = await services.recurringTasks.create({
    data: {
      ...input,
      rule,
      casaId
    }
  });
  return recurringTasks;
};

export const updateRecurringTaskMutationResolver: AppResolvers['Mutation']['updateRecurringTask'] = async (_, { recurringTaskId, input }, { services, casaId }) => {
  const rule = input.rule ? RecurringTaskRuleSchema.parse(input.rule) : undefined;

  const recurringTask = await services.recurringTasks.update({
    where: { id: recurringTaskId, casaId },
    data: {
      name: input.name ?? undefined,
      rule,
      startDate: input.startDate ?? undefined,
      equipmentId: input.equipmentId ? input.equipmentId.id : undefined,
      projectId: input.projectId ? input.projectId.id : undefined,
    }
  });

  return recurringTask;
};

export const deleteRecurringTaskMutationResolver: AppResolvers['Mutation']['deleteRecurringTask'] = async (_, { recurringTaskId }, { services, casaId }) => {
  await services.recurringTasks.delete({
    where: { id: recurringTaskId, casaId },
  });

  return true;
};