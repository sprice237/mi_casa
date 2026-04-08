import { AppResolvers } from "../types.js";

export const taskTypeResolver: AppResolvers['Task'] = {
  id: (root) => root.id,
  name: (root) => root.name,
  status: (root) => root.status,
  activityFeedId: (root) => root.activityFeedId,

  equipment: async (root, _, { db, casaId }) => {
    if (!root.equipmentId) return null;
    const equipment = await db.equipment.findUnique({ where: { id: root.equipmentId, casaId } });
    return equipment;
  },

  project: async (root, _, { db, casaId }) => {
    if (!root.projectId) return null;
    const project = await db.project.findUnique({ where: { id: root.projectId, casaId } });
    return project;
  },

  transitions: async (root, _, { db, casaId }) => {
    return await db.taskTransition.findMany({
      where: { taskId: root.id, casaId },
      orderBy: { createdAt: 'asc' },
    });
  },
}

export const taskTransitionTypeResolver: AppResolvers['TaskTransition'] = {
  id: (root) => root.id,
  createdAt: (root) => root.createdAt,
  prevStatus: (root) => root.prevStatus,
  nextStatus: (root) => root.nextStatus,
  performedBy: async (root, _, { db }) => {
    if (!root.userId) return null;
    return await db.user.findUnique({ where: { id: root.userId } });
  },
}
