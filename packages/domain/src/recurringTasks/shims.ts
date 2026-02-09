import { RecurringTask as DbRecurringTask } from "@mi_casa/db/client"
import { RecurringTask } from "./types"
import { RecurringTaskRuleSchema } from "@mi_casa/common"

export const shimRecurringTask = (dbRecurringTask: DbRecurringTask): RecurringTask => {
  return {
    ...dbRecurringTask,
    rule: RecurringTaskRuleSchema.parse(dbRecurringTask.rule)
  }
}