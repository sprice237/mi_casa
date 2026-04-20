import { AppResolvers } from "../types.js";

export const attachmentTypeResolver: AppResolvers['Attachment'] = {
  id: (root) => root.id,
  createdAt: (root) => root.createdAt,

  url: async (root, _, { services: { resourceService } }) => {
    return await resourceService.getResourceUrl(root.bucketKey);
  },

  thumbnailUrl: async (root, _, { db, services: { resourceService } }) => {
    if (root.thumbnailBucketKey) {
      return await resourceService.getResourceUrl(root.thumbnailBucketKey);
    }

    if (root.thumbnailIsReady === false) {
      // thumbnail is not ready yet, but is being processed, so return null for now
      // or thumbnail creation previously failed, in which case we also return null
      return null;
    }

    try {
      const thumbnail = await resourceService.createThumbnail(root.bucketKey);
      const thumbnailBucketKey = thumbnail.thumbnailKey;
      const thumbnailMimeType = thumbnail.mimeType;

      await db.attachment.update({
        where: { id: root.id },
        data: {
          thumbnailBucketKey,
          thumbnailMimeType,
          thumbnailIsReady: true,
        }
      });

      return await resourceService.getResourceUrl(thumbnailBucketKey);
    } catch (e) {
      console.error('error creating thumbnail', e);

      await db.attachment.update({
        where: { id: root.id },
        data: {
          thumbnailIsReady: false,
        }
      });

      return null;
    }

  }
}

export const createAttachmentTypeResolver: AppResolvers['CreateAttachmentPayload'] = {
  id: (root) => root.id,
  presignedPostUrl: (root) => root.presignedPostUrl,
  presignedPostFields: (root) => root.presignedPostFields,
}