import { AppResolvers } from "../types.js";

export const activityFeedTypeResolver: AppResolvers['ActivityFeed'] = {
  id: (root) => root.id,
  entries: (root) => root.entries,
}

export const activityFeedEntryTypeResolver: AppResolvers['ActivityFeedEntry'] = {
  id: (root) => root.id,
  createdAt: (root) => root.createdAt,
  note: (root) => root.note,

  attachments: async (root, _, { db, casaId }) => {
    const attachments = await db.activityFeedEntry.findUniqueOrThrow({ where: { id: root.id, casaId } }).attachments();
    return attachments;
  },
}