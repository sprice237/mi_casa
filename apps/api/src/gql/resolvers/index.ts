import { statusQueryResolver, statusTypeResolver } from "./status/index.js";
import { createTaskMutationResolver, deleteTaskMutationResolver, taskQueryResolver, tasksQueryResolver, taskTypeResolver, updateTaskMutationResolver } from "./tasks/index.js";
import { AppResolvers } from './types.js';
import { createRecurringTaskMutationResolver, deleteRecurringTaskMutationResolver, recurringTaskProjectionsQueryResolver, recurringTaskProjectionTypeResolver, recurringTaskQueryResolver, recurringTasksQueryResolver, recurringTaskTypeResolver, updateRecurringTaskMutationResolver } from "./recurringTasks/index.js";
import { scalars } from "@mi_casa/gql";
import { createEquipmentMutationResolver, createEquipmentNoteMutationResolver, deleteEquipmentMutationResolver, deleteEquipmentNoteMutationResolver, equipmentNoteTypeResolver, equipmentQueryResolver, equipmentsQueryResolver, equipmentTypeResolver, updateEquipmentMutationResolver, updateEquipmentNoteMutationResolver } from "./equipment/index.js";
import { createProjectMutationResolver, deleteProjectMutationResolver, projectQueryResolver, projectsQueryResolver, projectTypeResolver, updateProjectMutationResolver } from "./projects/index.js";


export const resolvers: AppResolvers = {
  Query: {
    equipments: equipmentsQueryResolver,
    equipment: equipmentQueryResolver,
    projects: projectsQueryResolver,
    project: projectQueryResolver,
    recurringTasks: recurringTasksQueryResolver,
    recurringTask: recurringTaskQueryResolver,
    recurringTaskProjections: recurringTaskProjectionsQueryResolver,
    tasks: tasksQueryResolver,
    task: taskQueryResolver,
    status: statusQueryResolver,
  },
  Mutation: {
    createEquipment: createEquipmentMutationResolver,
    updateEquipment: updateEquipmentMutationResolver,
    deleteEquipment: deleteEquipmentMutationResolver,
    createEquipmentNote: createEquipmentNoteMutationResolver,
    updateEquipmentNote: updateEquipmentNoteMutationResolver,
    deleteEquipmentNote: deleteEquipmentNoteMutationResolver,
    createProject: createProjectMutationResolver,
    updateProject: updateProjectMutationResolver,
    deleteProject: deleteProjectMutationResolver,
    createRecurringTask: createRecurringTaskMutationResolver,
    updateRecurringTask: updateRecurringTaskMutationResolver,
    deleteRecurringTask: deleteRecurringTaskMutationResolver,
    createTask: createTaskMutationResolver,
    updateTask: updateTaskMutationResolver,
    deleteTask: deleteTaskMutationResolver,
  },

  Equipment: equipmentTypeResolver,
  EquipmentNote: equipmentNoteTypeResolver,
  Status: statusTypeResolver,
  Project: projectTypeResolver,
  RecurringTask: recurringTaskTypeResolver,
  RecurringTaskProjection: recurringTaskProjectionTypeResolver,
  Task: taskTypeResolver,

  ...scalars,
}