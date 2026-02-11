import { RecurringTask as DbRecurringTask } from "@mi_casa/db/client"
import { RecurringTask, RecurringTaskProjection } from "./types"
import { RecurringTaskRuleSchema } from "@mi_casa/common"

export const shimRecurringTask = (dbRecurringTask: DbRecurringTask): RecurringTask => {
  return {
    ...dbRecurringTask,
    rule: RecurringTaskRuleSchema.parse(dbRecurringTask.rule)
  }
}

export const shimRecurringTaskProjection = ({ n, date, ...dbProjectedRecurringTask }: DbRecurringTask & { n: number, date: Date }): RecurringTaskProjection => {
  return {
    n,
    date,
    recurringTask: shimRecurringTask(dbProjectedRecurringTask),
  }
}