import { config } from "../../../config.js";
import { AppResolvers } from "../types.js";

export const statusQueryResolver: AppResolvers['Query']['status'] = () => {
  return {
    version: config.VERSION ?? 'unknown',
    data: { name: 'Mi Casa', version: config.VERSION ?? 'unknown' },
    currentDateTime: new Date()
  }
};