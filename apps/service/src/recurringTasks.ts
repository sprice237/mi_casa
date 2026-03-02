import { RecurringTasksService } from "@mi_casa/domain";
import { add, startOfDay } from "date-fns";
import { utc } from '@date-fns/utc'
import { PrismaClient } from "@mi_casa/db/client";

export async function generateTasksForRecurringTasks({ db }: { db: PrismaClient }) {
  const recurringTasksService = new RecurringTasksService(db)
  const recurringTasks = await recurringTasksService.findMany();
  console.log('recurringTasks:', recurringTasks);

  const startDate = startOfDay(new Date(), { in: utc });
  const endDate = startOfDay(add(startDate, { days: 1 }), { in: utc });

  for (const recurringTask of recurringTasks) {
    const latestTask = await recurringTasksService.findLatestTask({ where: { recurringTaskId: recurringTask.id } });
    console.log(`latest task for recurring task ${recurringTask.id}:`, latestTask);

    const nextProjectionStartDate = latestTask ? startOfDay(add(latestTask.createdAt, { days: 1 }), { in: utc }) : startDate;
    const nextProjectionEndDate = endDate;

    console.log({
      nextProjectionStartDate,
      nextProjectionEndDate
    })

    const [nextProjection] = await recurringTasksService.getProjections({
      where: { id: recurringTask.id, casaId: recurringTask.casaId },
      startDate: nextProjectionStartDate,
      endDate: nextProjectionEndDate, limit: 1
    });

    if (nextProjection) {
      console.log('creating task');
      await db.task.create({
        data: {
          casaId: recurringTask.casaId,
          recurringTaskId: recurringTask.id,
          name: recurringTask.name,
          status: 'READY_TO_BEGIN',
          equipmentId: recurringTask.equipmentId,
          projectId: recurringTask.projectId
        }
      })
    } else {
      console.log('not creating task');
    }

  }
}