import { AppResolvers } from "../types.js";

export const equipmentsQueryResolver: AppResolvers['Query']['equipments'] = async (_1, _2, { db, casaId }) => {
  const equipments = await db.equipment.findMany({
    where: {
      casaId,
    }
  });
  return equipments;
};

export const equipmentQueryResolver: AppResolvers['Query']['equipment'] = async (_, { equipmentId }, { db, casaId }) => {
  const equipment = await db.equipment.findUniqueOrThrow({
    where: { id: equipmentId, casaId }
  });

  return equipment;
};
