import { AppResolvers } from "../types.js";
import { randomUUID } from "node:crypto";

export const createAttachmentMutationResolver: AppResolvers['Mutation']['createAttachment'] = async (_, { input }, { db, services: { resourceService }, casaId }) => {
  const acceptableContentTypes = new Set(['image/jpeg'] as const);

  if (!acceptableContentTypes.has(input.contentType as never)) {
    throw new Error('invalid content type provided')
  }

  const id = randomUUID();
  const key = `casa/${casaId}/attachments/${id}`;

  await db.attachment.create({
    data: {
      id,
      bucketKey: key,
      isReady: false,
      casaId,
      mimeType: input.contentType,
    }
  })

  const { url, fields } = await resourceService.createPresignedPost(key, { contentType: input.contentType });

  return {
    id,
    presignedPostUrl: url,
    presignedPostFields: fields,
  }
};

export const updateAttachmentMutationResolver: AppResolvers['Mutation']['updateAttachment'] = async (_, { input }, { db, casaId }) => {
  return await db.attachment.update({
    where: {
      id: input.attachmentId,
      casaId,
    },
    data: {
      isReady: input.isReady,
    }
  })
};

export const deleteAttachmentMutationResolver: AppResolvers['Mutation']['deleteAttachment'] = async (_, { attachmentId }, { db, casaId }) => {
  await db.attachment.delete({
    where: { id: attachmentId, casaId },
  });

  return true;
};