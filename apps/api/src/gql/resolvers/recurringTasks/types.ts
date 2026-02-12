import { AppResolvers } from "../types.js";

export const recurringTaskTypeResolver: AppResolvers['RecurringTask'] = {
  id: (root) => root.id,
  name: (root) => root.name,
  rule: (root) => root.rule,
}

export const recurringTaskProjectionTypeResolver: AppResolvers['RecurringTaskProjection'] = {
  id: (root) => root.id,
  n: (root) => root.n,
  date: (root) => root.date,
  recurringTask: (root) => root.recurringTask,
}
