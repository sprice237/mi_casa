import { AppResolvers } from "../types.js";

export const attachmentQueryResolver: AppResolvers['Query']['attachment'] = async (_, { attachmentId }, { db, casaId }) => {
  return await db.attachment.findUniqueOrThrow({
    where: {
      id: attachmentId,
      isReady: true,
      casaId,
    },
  })
};