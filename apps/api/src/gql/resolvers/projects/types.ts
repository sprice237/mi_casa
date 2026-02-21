import { AppResolvers } from "../types.js";

export const projectTypeResolver: AppResolvers['Project'] = {
  id: (root) => root.id,
  name: (root) => root.name,

  recurringTasks: async (root, _, { services }) => {
    const recurringTasks = await services.recurringTasks.findMany({ where: { projectId: root.id } });
    return recurringTasks;
  },

  tasks: async (root, _, { db }) => {
    const tasks = await db.task.findMany({ where: { projectId: root.id } });
    return tasks;
  }

}