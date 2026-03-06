import { AppResolvers } from "../types.js";

export const taskTypeResolver: AppResolvers['Task'] = {
  id: (root) => root.id,
  name: (root) => root.name,
  status: (root) => root.status,

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

  attachments: async (root, _, { db, casaId }) => {
    const attachments = await db.task.findUniqueOrThrow({ where: { id: root.id, casaId } }).attachments();
    return attachments;
  },

  notes: async (root, _, { db, casaId }) => {
    const notes = await db.task.findUniqueOrThrow({ where: { id: root.id, casaId } }).notes();
    return notes;
  },
}
