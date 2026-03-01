import { AppResolvers } from "../types.js";
import { Prisma } from "@mi_casa/db/client";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { randomUUID } from "node:crypto";
import { config } from "../../../config.js";

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

export const createEquipmentNoteMutationResolver: AppResolvers['Mutation']['createEquipmentNote'] = async (_, { input }, { db, casaId }) => {
  const equipmentNote = await db.equipmentNote.create({
    data: {
      equipmentId: input.equipmentId,
      content: input.content,
      casaId
    }
  });
  return equipmentNote;
};

export const updateEquipmentNoteMutationResolver: AppResolvers['Mutation']['updateEquipmentNote'] = async (_, { equipmentNoteId, input }, { db, casaId }) => {
  const equipmentNote = await db.equipmentNote.update({
    where: { id: equipmentNoteId, casaId },
    data: {
      content: input.content ?? Prisma.skip,
    }
  });

  return equipmentNote;
};

export const deleteEquipmentNoteMutationResolver: AppResolvers['Mutation']['deleteEquipmentNote'] = async (_, { equipmentNoteId }, { db, casaId }) => {
  await db.equipmentNote.delete({
    where: { id: equipmentNoteId, casaId },
  });

  return true;
};

export const createEquipmentAttachmentMutationResolver: AppResolvers['Mutation']['createEquipmentAttachment'] = async (_, { input }, { db, s3, casaId }) => {
  const acceptableContentTypes = new Set(['image/jpeg'] as const);

  if (!acceptableContentTypes.has(input.contentType as never)) {
    throw new Error('invalid content type provided')
  }

  const id = randomUUID();
  const key = `equipment/${input.equipmentId}/attachments/${id}`;

  await db.equipmentAttachment.create({
    data: {
      id,
      equipmentId: input.equipmentId,
      bucketKey: key,
      isReady: false,
      casaId
    }
  })

  const { url, fields } = await createPresignedPost(s3, {
    Bucket: config.AWS_BUCKET,
    Key: key,
    Conditions: [
      ['eq', '$Content-Type', input.contentType],
      ['content-length-range', 1, 10 * 1024 * 1024],
    ],
    Fields: {
      'Content-Type': input.contentType
    }
  });

  return {
    id,
    presignedPostUrl: url,
    presignedPostFields: fields,
  }
};

export const updateEquipmentAttachmentMutationResolver: AppResolvers['Mutation']['updateEquipmentAttachment'] = async (_, { input }, { db, casaId }) => {
  return await db.equipmentAttachment.update({
    where: {
      id: input.equipmentAttachmentId,
      casaId,
    },
    data: {
      isReady: input.isReady,
    }
  })
};

export const deleteEquipmentAttachmentMutationResolver: AppResolvers['Mutation']['deleteEquipmentAttachment'] = async (_, { equipmentAttachmentId }, { db, casaId }) => {
  await db.equipmentAttachment.delete({
    where: { id: equipmentAttachmentId, casaId },
  });

  return true;
};