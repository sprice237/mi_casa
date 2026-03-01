import { RecurringTask as DbRecurringTask } from '@mi_casa/db/client'
import { RecurringTaskRule } from '@mi_casa/common';

export type RecurringTask = Omit<DbRecurringTask, 'rule'> & {
  rule: RecurringTaskRule
  equipmentId: string | null;
  projectId: string | null;
}

export type CreateRecurringTaskInput = {
  id?: string;
  name: string;
  rule: RecurringTaskRule
  startDate: Date;
  equipmentId: string | null;
  projectId: string | null;
  casaId: string;
}

export type UpdateRecurringTaskInput = {
  name?: string;
  rule?: RecurringTaskRule
  startDate?: Date;
  equipmentId?: string | null;
  projectId?: string | null;
}

export type RecurringTaskProjection = {
  recurringTask: RecurringTask;
  n: number;
  date: Date;
}