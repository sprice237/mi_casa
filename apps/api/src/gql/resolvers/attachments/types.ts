import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { AppResolvers } from "../types.js";
import { config } from "../../../config.js";

export const attachmentTypeResolver: AppResolvers['Attachment'] = {
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

export const createAttachmentTypeResolver: AppResolvers['CreateAttachmentPayload'] = {
  id: (root) => root.id,
  presignedPostUrl: (root) => root.presignedPostUrl,
  presignedPostFields: (root) => root.presignedPostFields,
}