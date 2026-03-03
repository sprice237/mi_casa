import { AppResolvers } from "../types.js";

export const noteTypeResolver: AppResolvers['Note'] = {
  id: (root) => root.id,
  content: (root) => root.content,
  createdAt: (root) => root.createdAt,
}
