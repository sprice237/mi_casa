import { AppResolvers } from "../types.js";

export const statusTypeResolver: AppResolvers['Status'] = {
  version: (parent) => parent.version,
  data: (parent) => parent.data,
  currentDateTime: (parent) => parent.currentDateTime,
}
