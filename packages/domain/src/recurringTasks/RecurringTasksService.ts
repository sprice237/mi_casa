import { Prisma, PrismaClient } from '@mi_casa/db/client';
import { shimRecurringTask } from './shims';
import { CreateRecurringTaskInput, UpdateRecurringTaskInput } from './types';


export class RecurringTasksService {

  constructor(private db: PrismaClient) { }

  async findMany(args?: Pick<NonNullable<Parameters<typeof this.db.recurringTask.findMany>[0]>, 'where' | 'orderBy' | 'skip' | 'take'>) {
    const dbRecurringTasks = await this.db.recurringTask.findMany(args);
    const recurringTasks = dbRecurringTasks.map(shimRecurringTask);
    return recurringTasks
  }

  async findUniqueOrThrow(args: Pick<NonNullable<Parameters<typeof this.db.recurringTask.findUniqueOrThrow>[0]>, 'where'>) {
    const dbRecurringTask = await this.db.recurringTask.findUniqueOrThrow(args);
    const recurringTask = shimRecurringTask(dbRecurringTask);
    return recurringTask
  }

  async create({ data }: { data: CreateRecurringTaskInput }) {
    const dbRecurringTask = await this.db.recurringTask.create({ data });
    const recurringTask = shimRecurringTask(dbRecurringTask);
    return recurringTask
  }

  async update({ where, data }: Pick<Parameters<typeof this.db.recurringTask.update>[0], 'where'> & { data: UpdateRecurringTaskInput }) {
    const dbRecurringTask = await this.db.recurringTask.update({
      where, data: {
        name: data.name ?? Prisma.skip,
        rule: data.rule ?? Prisma.skip,
      }
    });
    const recurringTask = shimRecurringTask(dbRecurringTask);
    return recurringTask
  }

  async delete({ where }: Pick<Parameters<typeof this.db.recurringTask.delete>[0], 'where'>) {
    const dbRecurringTask = await this.db.recurringTask.delete({
      where
    });
    const recurringTask = shimRecurringTask(dbRecurringTask);
    return recurringTask
  }
}