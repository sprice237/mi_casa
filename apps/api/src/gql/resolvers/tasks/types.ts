import { AppResolvers } from "../types.js";

export const taskTypeResolver: AppResolvers['Task'] = {
  id: (root) => root.id,
  name: (root) => root.name,
  status: (root) => root.status,
}
