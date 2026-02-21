import { AppResolvers } from "../types.js";

export const taskTypeResolver: AppResolvers['Task'] = {
  id: (root) => root.id,
  name: (root) => root.name,
  status: (root) => root.status,

  equipment: async (root, _, { db }) => {
    if (!root.equipmentId) return null;
    const equipment = await db.equipment.findUnique({ where: { id: root.equipmentId } });
    return equipment;
  }
}
