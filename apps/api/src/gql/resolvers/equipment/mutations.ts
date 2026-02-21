import { AppResolvers } from "../types.js";
import { Prisma } from "@mi_casa/db/client";

export const createEquipmentMutationResolver: AppResolvers['Mutation']['createEquipment'] = async (_, { input }, { db }) => {
  const equipment = await db.equipment.create({
    data: {
      name: input.name,
    }
  });
  return equipment;
};

export const updateEquipmentMutationResolver: AppResolvers['Mutation']['updateEquipment'] = async (_, { equipmentId, input }, { db }) => {
  const equipment = await db.equipment.update({
    where: { id: equipmentId },
    data: {
      name: input.name ?? Prisma.skip,
    }
  });

  return equipment;
};

export const deleteEquipmentMutationResolver: AppResolvers['Mutation']['deleteEquipment'] = async (_, { equipmentId }, { db }) => {
  await db.equipment.delete({
    where: { id: equipmentId },
  });

  return true;
};