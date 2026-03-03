import { AppResolvers } from "../types.js";
import { Prisma } from "@mi_casa/db/client";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { randomUUID } from "node:crypto";
import { config } from "../../../config.js";


export const createAttachmentMutationResolver: AppResolvers['Mutation']['createAttachment'] = async (_, { input }, { db, s3, casaId }) => {
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