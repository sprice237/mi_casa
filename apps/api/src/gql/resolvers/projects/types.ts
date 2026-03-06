import { AppResolvers } from "../types.js";

export const projectTypeResolver: AppResolvers['Project'] = {
  id: (root) => root.id,
  name: (root) => root.name,

  recurringTasks: async (root, _, { services, casaId }) => {
    const recurringTasks = await services.recurringTasks.findMany({ where: { projectId: root.id }, tenant: { casaId } });
    return recurringTasks;
  },

  tasks: async (root, _, { db, casaId }) => {
    const tasks = await db.task.findMany({ where: { projectId: root.id, casaId } });
    return tasks;
  }

}