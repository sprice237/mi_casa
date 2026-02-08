import { AppResolvers } from "../types";

export const statusTypeResolver: AppResolvers['Status'] = {
  version: (parent) => parent.version
}
