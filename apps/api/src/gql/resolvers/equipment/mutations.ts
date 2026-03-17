import { AppResolvers } from "../types.js";
import { Prisma } from "@mi_casa/db/client";

export const createEquipmentMutationResolver: AppResolvers['Mutation']['createEquipment'] = async (_, { input }, { db, casaId }) => {
  const equipment = await db.equipment.create({
    data: {
      name: input.name,
      casa: {
        connect: { id: casaId }
      },
      activityFeed: {
        create: {
          casaId
        }
      }
    }
  });
  return equipment;
};

export const updateEquipmentMutationResolver: AppResolvers['Mutation']['updateEquipment'] = async (_, { equipmentId, input }, { db, casaId }) => {
  const equipment = await db.equipment.update({
    where: { id: equipmentId, casaId },
    data: {
      name: input.name ?? Prisma.skip,
    }
  });

  return equipment;
};

export const deleteEquipmentMutationResolver: AppResolvers['Mutation']['deleteEquipment'] = async (_, { equipmentId }, { db, casaId }) => {
  await db.equipment.delete({
    where: { id: equipmentId, casaId },
  });

  return true;
};
