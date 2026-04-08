import { AppResolvers } from "../types.js";

export const userTypeResolver: AppResolvers['User'] = {
  id: (root) => root.id,
  username: (root) => root.username,
}
