import { AppResolvers } from "../types.js";

export const activityFeedQueryResolver: AppResolvers['Query']['activityFeed'] = async (_, { activityFeedId }, { db, casaId }) => {
  const activityFeed = await db.activityFeed.findUniqueOrThrow({
    where: {
      id: activityFeedId,
      casaId,
    },
    include: {
      entries: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
  return activityFeed;
};