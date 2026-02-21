import { AppResolvers } from "../types.js";

export const equipmentsQueryResolver: AppResolvers['Query']['equipments'] = async (_1, _2, { db }) => {
  const equipments = await db.equipment.findMany();
  return equipments;
};

export const equipmentQueryResolver: AppResolvers['Query']['equipment'] = async (_, { equipmentId }, { db }) => {
  const equipment = await db.equipment.findUniqueOrThrow({
    where: { id: equipmentId }
  });

  return equipment;
};