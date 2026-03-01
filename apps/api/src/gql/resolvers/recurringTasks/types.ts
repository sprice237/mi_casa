import { AppResolvers } from "../types.js";

export const recurringTaskTypeResolver: AppResolvers['RecurringTask'] = {
  id: (root) => root.id,
  name: (root) => root.name,
  rule: (root) => root.rule,

  equipment: async (root, _, { db, casaId }) => {
    if (!root.equipmentId) return null;
    const equipment = await db.equipment.findUnique({ where: { id: root.equipmentId, casaId } });
    return equipment;
  },

  project: async (root, _, { db, casaId }) => {
    if (!root.projectId) return null;
    const project = await db.project.findUnique({ where: { id: root.projectId, casaId } });
    return project;
  }
}

export const recurringTaskProjectionTypeResolver: AppResolvers['RecurringTaskProjection'] = {
  id: (root) => root.id,
  n: (root) => root.n,
  date: (root) => root.date,
  recurringTask: (root) => root.recurringTask,
}
