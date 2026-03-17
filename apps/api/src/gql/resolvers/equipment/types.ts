import { AppResolvers } from "../types.js";

export const equipmentTypeResolver: AppResolvers['Equipment'] = {
  id: (root) => root.id,
  name: (root) => root.name,
  activityFeedId: (root) => root.activityFeedId,

  recurringTasks: async (root, _, { services, casaId }) => {
    const recurringTasks = await services.recurringTasks.findMany({ where: { equipmentId: root.id }, tenant: { casaId } });
    return recurringTasks;
  },

  tasks: async (root, _, { db, casaId }) => {
    const tasks = await db.task.findMany({ where: { equipmentId: root.id, casaId } });
    return tasks;
  }
}
