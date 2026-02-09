import { AppResolvers } from "../types";

export const recurringTaskTypeResolver: AppResolvers['RecurringTask'] = {
  id: (root) => root.id,
  name: (root) => root.name,
  rule: (root) => root.rule,
}
