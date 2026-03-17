import { AppResolvers } from "../types.js";
import { Prisma } from "@mi_casa/db/client";

export const createActivityFeedEntryResolver: AppResolvers['Mutation']['createActivityFeedEntry'] = async (_, { input }, { db, casaId, jwt }) => {
  const activityFeedEntry = await db.activityFeedEntry.create({
    data: {
      casaId,
      activityFeedId: input.activityFeedId,
      userId: jwt.sub,
      note: input.note ?? null,
      ...(input.attachmentIds && {
        attachments: {
          connect: input.attachmentIds.map(attachmentId => ({
            id: attachmentId
          }))
        }
      }),
    }
  });

  return activityFeedEntry;
};