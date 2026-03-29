import { AppResolvers } from "../types.js";

export const attachmentTypeResolver: AppResolvers['Attachment'] = {
  id: (root) => root.id,
  createdAt: (root) => root.createdAt,

  url: async (root, _, { services: { resourceService } }) => {
    return await resourceService.getResourceUrl(root.bucketKey);
  },
}

export const createAttachmentTypeResolver: AppResolvers['CreateAttachmentPayload'] = {
  id: (root) => root.id,
  presignedPostUrl: (root) => root.presignedPostUrl,
  presignedPostFields: (root) => root.presignedPostFields,
}