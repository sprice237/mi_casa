import { AppResolvers } from "../types.js";
import { Prisma } from "@mi_casa/db/client";

export const createEquipmentMutationResolver: AppResolvers['Mutation']['createEquipment'] = async (_, { input }, { db, casaId }) => {
  const equipment = await db.equipment.create({
    data: {
      name: input.name,
      casaId,
    }
  });
  return equipment;
};

export const updateEquipmentMutationResolver: AppResolvers['Mutation']['updateEquipment'] = async (_, { equipmentId, input }, { db, casaId }) => {
  const equipment = await db.equipment.update({
    where: { id: equipmentId, casaId },
    data: {
      name: input.name ?? Prisma.skip,
      ...(input.attachmentIds && {
        attachments: {
          ...(input.attachmentIds.attach && {
            connect: input.attachmentIds.attach.map(attachmentId => ({
              id: attachmentId
            }))
          }),
          ...(input.attachmentIds.detach && {
            disconnect: input.attachmentIds.detach.map(attachmentId => ({
              id: attachmentId
            }))
          })

        }
      }),
      ...(input.noteIds && {
        notes: {
          ...(input.noteIds.attach && {
            connect: input.noteIds.attach.map(noteId => ({
              id: noteId
            }))
          }),
          ...(input.noteIds.detach && {
            disconnect: input.noteIds.detach.map(noteId => ({
              id: noteId
            }))
          })

        }
      })

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
