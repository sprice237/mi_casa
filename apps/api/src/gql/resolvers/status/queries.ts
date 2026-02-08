import { config } from "../../../config";
import { AppResolvers } from "../types";

export const statusQueryResolver: AppResolvers['Query']['status'] = () => {
  return {
    version: config.VERSION ?? 'unknown'
  }
};