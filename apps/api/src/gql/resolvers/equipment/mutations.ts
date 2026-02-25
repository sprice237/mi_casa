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

export const createEquipmentNoteMutationResolver: AppResolvers['Mutation']['createEquipmentNote'] = async (_, { input }, { db }) => {
  const equipmentNote = await db.equipmentNote.create({
    data: {
      equipmentId: input.equipmentId,
      content: input.content,
    }
  });
  return equipmentNote;
};

export const updateEquipmentNoteMutationResolver: AppResolvers['Mutation']['updateEquipmentNote'] = async (_, { equipmentNoteId, input }, { db }) => {
  const equipmentNote = await db.equipmentNote.update({
    where: { id: equipmentNoteId },
    data: {
      content: input.content ?? Prisma.skip,
    }
  });

  return equipmentNote;
};

export const deleteEquipmentNoteMutationResolver: AppResolvers['Mutation']['deleteEquipmentNote'] = async (_, { equipmentNoteId }, { db }) => {
  await db.equipmentNote.delete({
    where: { id: equipmentNoteId },
  });

  return true;
};