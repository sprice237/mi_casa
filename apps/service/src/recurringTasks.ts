import { RecurringTasksService } from "@mi_casa/domain";
import { add, startOfDay } from "date-fns";
import { utc } from '@date-fns/utc'
import { PrismaClient } from "@mi_casa/db/client";

export async function generateTasksForRecurringTasks({ db }: { db: PrismaClient }) {
  const recurringTasksService = new RecurringTasksService(db)

  const casas = await db.casa.findMany();

  for (const casa of casas) {
    console.log(`casaId: ${casa.id}`);
    const recurringTasks = await recurringTasksService.findMany({ tenant: { casaId: casa.id } });
    console.log('recurringTasks:', recurringTasks);

    const startDate = startOfDay(new Date(), { in: utc });
    const endDate = startOfDay(add(startDate, { days: 1 }), { in: utc });

    for (const recurringTask of recurringTasks) {
      const latestTask = await recurringTasksService.findLatestTask({ where: { id: recurringTask.id }, tenant: { casaId: casa.id } });
      console.log(`latest task for recurring task ${recurringTask.id}:`, latestTask);

      const nextProjectionStartDate = latestTask ? startOfDay(add(latestTask.createdAt, { days: 1 }), { in: utc }) : startDate;
      const nextProjectionEndDate = endDate;

      console.log({
        nextProjectionStartDate,
        nextProjectionEndDate
      })

      const [nextProjection] = await recurringTasksService.getProjections({
        where: { id: recurringTask.id },
        startDate: nextProjectionStartDate,
        endDate: nextProjectionEndDate,
        limit: 1,
        tenant: { casaId: recurringTask.casaId }
      });

      if (nextProjection) {
        console.log('creating task');
        await db.task.create({
          data: {
            casa: {
              connect: { id: recurringTask.casaId }
            },
            recurringTask: {
              connect: { id: recurringTask.id }
            },
            equipment: recurringTask.equipmentId ? {
              connect: { id: recurringTask.equipmentId }
            } : undefined,
            project: recurringTask.projectId ? {
              connect: { id: recurringTask.projectId }
            } : undefined,
            activityFeed: {
              create: {
                casaId: recurringTask.casaId,
              }
            },
            name: recurringTask.name,
            status: 'READY_TO_BEGIN',
          }
        })
      } else {
        console.log('not creating task');
      }

    }
  }
}