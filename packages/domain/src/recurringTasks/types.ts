import { RecurringTask as DbRecurringTask } from '@mi_casa/db/client'
import { RecurringTaskRule } from '@mi_casa/common';

export type RecurringTask = Omit<DbRecurringTask, 'rule'> & {
  rule: RecurringTaskRule
}

export type CreateRecurringTaskInput = {
  id?: string;
  name: string;
  rule: RecurringTaskRule
}

export type UpdateRecurringTaskInput = {
  name?: string;
  rule?: RecurringTaskRule
}