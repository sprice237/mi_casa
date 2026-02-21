import { AppResolvers } from "../types.js";

export const equipmentTypeResolver: AppResolvers['Equipment'] = {
  id: (root) => root.id,
  name: (root) => root.name,

  recurringTasks: async (root, _, { services }) => {
    const recurringTasks = await services.recurringTasks.findMany({ where: { equipmentId: root.id } });
    return recurringTasks;
  },

  tasks: async (root, _, { db }) => {
    const tasks = await db.task.findMany({ where: { equipmentId: root.id } });
    return tasks;
  }

}