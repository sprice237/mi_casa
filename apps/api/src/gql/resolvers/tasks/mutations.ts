import { AppResolvers } from "../types.js";

export const createTaskMutationResolver: AppResolvers['Mutation']['createTask'] = async (_, { input }, { services, casaId }) => {
  const task = await services.tasks.create({
    data: {
      name: input.name,
      status: 'READY_TO_BEGIN',
      equipmentId: input.equipmentId,
      projectId: input.projectId,
    },
    tenant: {
      casaId
    }
  });

  return task;
};

export const updateTaskMutationResolver: AppResolvers['Mutation']['updateTask'] = async (_, { taskId, input }, { services, casaId, jwt }) => {
  const task = await services.tasks.update({
    where: { id: taskId },
    data: {
      name: input.name ?? undefined,
      status: input.status ?? undefined,
      equipmentId: input.equipmentId ? (input.equipmentId.id ?? null) : undefined,
      projectId: input.projectId ? (input.projectId.id ?? null) : undefined,
      attachmentIds: input.attachmentIds ? {
        attach: input.attachmentIds.attach ?? undefined,
        detach: input.attachmentIds.detach ?? undefined
      } : undefined,
      noteIds: input.noteIds ? {
        attach: input.noteIds.attach ?? undefined,
        detach: input.noteIds.detach ?? undefined
      } : undefined,
      userId: jwt.sub
    },
    tenant: { casaId }
  });

  return task;
};

export const deleteTaskMutationResolver: AppResolvers['Mutation']['deleteTask'] = async (_, { taskId }, { services, casaId }) => {
  await services.tasks.delete({
    where: { id: taskId },
    tenant: { casaId }
  });

  return true;
};