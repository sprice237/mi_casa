import { AppResolvers } from "../types.js";

export const equipmentTypeResolver: AppResolvers['Equipment'] = {
  id: (root) => root.id,
  name: (root) => root.name,

  equipmentNotes: async (root, _, { db }) => {
    const equipmentNotes = await db.equipmentNote.findMany({ where: { equipmentId: root.id } });
    return equipmentNotes;
  },

  recurringTasks: async (root, _, { services }) => {
    const recurringTasks = await services.recurringTasks.findMany({ where: { equipmentId: root.id } });
    return recurringTasks;
  },

  tasks: async (root, _, { db }) => {
    const tasks = await db.task.findMany({ where: { equipmentId: root.id } });
    return tasks;
  }
}

export const equipmentNoteTypeResolver: AppResolvers['EquipmentNote'] = {
  id: (root) => root.id,
  content: (root) => root.content,
  createdAt: (root) => root.createdAt,

  equipment: async (root, _, { db }) => {
    const equipment = await db.equipment.findUniqueOrThrow({ where: { id: root.equipmentId } });
    return equipment;
  },
}