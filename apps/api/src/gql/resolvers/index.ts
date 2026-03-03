import { statusQueryResolver, statusTypeResolver } from "./status/index.js";
import { createTaskMutationResolver, deleteTaskMutationResolver, taskQueryResolver, tasksQueryResolver, taskTypeResolver, updateTaskMutationResolver } from "./tasks/index.js";
import { AppResolvers } from './types.js';
import { createRecurringTaskMutationResolver, deleteRecurringTaskMutationResolver, recurringTaskProjectionsQueryResolver, recurringTaskProjectionTypeResolver, recurringTaskQueryResolver, recurringTasksQueryResolver, recurringTaskTypeResolver, updateRecurringTaskMutationResolver } from "./recurringTasks/index.js";
import { scalars } from "@mi_casa/gql";
import { createEquipmentMutationResolver, deleteEquipmentMutationResolver, equipmentQueryResolver, equipmentsQueryResolver, equipmentTypeResolver, updateEquipmentMutationResolver } from "./equipment/index.js";
import { createProjectMutationResolver, deleteProjectMutationResolver, projectQueryResolver, projectsQueryResolver, projectTypeResolver, updateProjectMutationResolver } from "./projects/index.js";
import { attachmentQueryResolver, attachmentTypeResolver, createAttachmentMutationResolver, createAttachmentTypeResolver, deleteAttachmentMutationResolver, updateAttachmentMutationResolver } from "./attachments/index.js";
import { createNoteMutationResolver, deleteNoteMutationResolver, noteTypeResolver, updateNoteMutationResolver } from "./notes/index.js";


export const resolvers: AppResolvers = {
  Query: {
    attachment: attachmentQueryResolver,
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
    createAttachment: createAttachmentMutationResolver,
    updateAttachment: updateAttachmentMutationResolver,
    deleteAttachment: deleteAttachmentMutationResolver,
    createEquipment: createEquipmentMutationResolver,
    updateEquipment: updateEquipmentMutationResolver,
    deleteEquipment: deleteEquipmentMutationResolver,
    createNote: createNoteMutationResolver,
    updateNote: updateNoteMutationResolver,
    deleteNote: deleteNoteMutationResolver,
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

  Attachment: attachmentTypeResolver,
  CreateAttachmentPayload: createAttachmentTypeResolver,
  Equipment: equipmentTypeResolver,
  Note: noteTypeResolver,
  Status: statusTypeResolver,
  Project: projectTypeResolver,
  RecurringTask: recurringTaskTypeResolver,
  RecurringTaskProjection: recurringTaskProjectionTypeResolver,
  Task: taskTypeResolver,

  ...scalars,
}