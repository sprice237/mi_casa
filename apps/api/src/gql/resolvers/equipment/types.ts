import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AppResolvers } from "../types.js";
import { config } from "../../../config.js";

export const equipmentTypeResolver: AppResolvers['Equipment'] = {
  id: (root) => root.id,
  name: (root) => root.name,

  equipmentNotes: async (root, _, { db, casaId }) => {
    const equipmentNotes = await db.equipmentNote.findMany({ where: { equipmentId: root.id, casaId } });
    return equipmentNotes;
  },

  recurringTasks: async (root, _, { services, casaId }) => {
    const recurringTasks = await services.recurringTasks.findMany({ where: { equipmentId: root.id, casaId } });
    return recurringTasks;
  },

  tasks: async (root, _, { db, casaId }) => {
    const tasks = await db.task.findMany({ where: { equipmentId: root.id, casaId } });
    return tasks;
  }
}

export const equipmentNoteTypeResolver: AppResolvers['EquipmentNote'] = {
  id: (root) => root.id,
  content: (root) => root.content,
  createdAt: (root) => root.createdAt,

  equipment: async (root, _, { db, casaId }) => {
    const equipment = await db.equipment.findUniqueOrThrow({ where: { id: root.equipmentId, casaId } });
    return equipment;
  },
}

export const equipmentAttachmentTypeResolver: AppResolvers['EquipmentAttachment'] = {
  id: (root) => root.id,
  createdAt: (root) => root.createdAt,

  url: async (root, _, { s3 }) => {
    const command = new GetObjectCommand({
      Bucket: config.AWS_BUCKET,
      Key: root.bucketKey
    });
    const url = await getSignedUrl(s3, command);
    return url;
  },
}

export const createEquipmentAttachmentTypeResolver: AppResolvers['CreateEquipmentAttachmentPayload'] = {
  id: (root) => root.id,
  presignedPostUrl: (root) => root.presignedPostUrl,
  presignedPostFields: (root) => root.presignedPostFields,
}