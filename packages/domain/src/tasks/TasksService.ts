import { Prisma, PrismaClient } from '@mi_casa/db/client';
import { Tenant } from '../common/types.js';
import { TaskCreateData, TasksFindManyFilter, TasksFindUniqueFilter, TaskUpdateData } from './types.js';


export class TasksService {
  constructor(private db: PrismaClient) { }

  async findMany({ where, tenant }: { where?: TasksFindManyFilter; tenant: Tenant }) {
    const tasks = await this.db.task.findMany({
      where: {
        status: where?.status ?? Prisma.skip,
        equipmentId: where?.equipmentId ?? Prisma.skip,
        casaId: tenant.casaId
      }
    });
    return tasks;
  }

  async findUnique({ where, tenant }: { where: TasksFindUniqueFilter, tenant: Tenant }) {
    return await this.db.task.findUniqueOrThrow({
      where: {
        id: where.id,
        casaId: tenant.casaId
      }
    });
  }

  async create({ data, tenant }: { data: TaskCreateData, tenant: Tenant }) {
    return await this.db.$transaction(async tx => {
      const task = await tx.task.create({
        data: {
          casa: { connect: { id: tenant.casaId } },
          name: data.name,
          status: data.status,
          equipment: data.equipmentId ? { connect: { id: data.equipmentId } } : Prisma.skip,
          project: data.projectId ? { connect: { id: data.projectId } } : Prisma.skip,
          activityFeed: {
            create: {
              casaId: tenant.casaId
            }
          }
        }
      });

      await tx.taskTransition.create({
        data: {
          taskId: task.id,
          casaId: tenant.casaId,
          userId: data.userId ?? Prisma.skip,
          prevStatus: null,
          nextStatus: task.status
        }
      })

      return task;
    })
  }

  async update({ where, data, tenant }: { where: TasksFindUniqueFilter, data: TaskUpdateData, tenant: Tenant }) {
    return await this.db.$transaction(async tx => {
      const prevTask = await tx.task.findUniqueOrThrow({
        where: {
          id: where.id,
          casaId: tenant.casaId,
        }
      });

      const updatedTask = await tx.task.update({
        where: {
          id: where.id,
          casaId: tenant.casaId,
        },
        data: {
          name: data.name !== undefined ? data.name : Prisma.skip,
          status: data.status !== undefined ? data.status : Prisma.skip,
          equipmentId: data.equipmentId !== undefined ? data.equipmentId : Prisma.skip,
          projectId: data.projectId !== undefined ? data.projectId : Prisma.skip,
        }
      });

      if (prevTask.status !== updatedTask.status) {
        await tx.taskTransition.create({
          data: {
            taskId: where.id,
            casaId: tenant.casaId,
            userId: data.userId ?? Prisma.skip,
            prevStatus: prevTask.status,
            nextStatus: updatedTask.status
          }
        })
      }

      return updatedTask;
    })
  }

  async delete({ where, tenant }: { where: TasksFindUniqueFilter, tenant: Tenant }) {
    return await this.db.task.delete({
      where: {
        id: where.id,
        casaId: tenant.casaId
      }
    });
  }
}