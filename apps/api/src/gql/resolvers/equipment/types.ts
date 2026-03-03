import { AppResolvers } from "../types.js";

export const equipmentTypeResolver: AppResolvers['Equipment'] = {
  id: (root) => root.id,
  name: (root) => root.name,

  attachments: async (root, _, { db, casaId }) => {
    const attachments = await db.equipment.findUniqueOrThrow({ where: { id: root.id, casaId } }).attachments();
    return attachments;
  },

  notes: async (root, _, { db, casaId }) => {
    const notes = await db.equipment.findUniqueOrThrow({ where: { id: root.id, casaId } }).notes();
    return notes;
  },

  recurringTasks: async (root, _, { services, casaId }) => {
    const recurringTasks = await services.recurringTasks.findMany({ where: { equipmentId: root.id, casaId } });
    return recurringTasks;
  },

  tasks: async (root, _, { db, casaId }) => {
    const tasks = await db.task.findMany({ where: { equipmentId: root.id, casaId } });
    return tasks;
  }
}
