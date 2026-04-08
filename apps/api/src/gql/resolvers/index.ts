import { statusQueryResolver, statusTypeResolver } from "./status/index.js";
import { createTaskMutationResolver, deleteTaskMutationResolver, taskQueryResolver, tasksQueryResolver, taskTransitionTypeResolver, taskTypeResolver, updateTaskMutationResolver } from "./tasks/index.js";
import { userTypeResolver } from "./users/index.js";
import { AppResolvers } from './types.js';
import { createRecurringTaskMutationResolver, deleteRecurringTaskMutationResolver, recurringTaskProjectionsQueryResolver, recurringTaskProjectionTypeResolver, recurringTaskQueryResolver, recurringTasksQueryResolver, recurringTaskTypeResolver, updateRecurringTaskMutationResolver } from "./recurringTasks/index.js";
import { scalars } from "@mi_casa/gql";
import { createEquipmentMutationResolver, deleteEquipmentMutationResolver, equipmentQueryResolver, equipmentsQueryResolver, equipmentTypeResolver, updateEquipmentMutationResolver } from "./equipment/index.js";
import { createProjectMutationResolver, deleteProjectMutationResolver, projectQueryResolver, projectsQueryResolver, projectTypeResolver, updateProjectMutationResolver } from "./projects/index.js";
import { attachmentQueryResolver, attachmentTypeResolver, createAttachmentMutationResolver, createAttachmentTypeResolver, deleteAttachmentMutationResolver, updateAttachmentMutationResolver } from "./attachments/index.js";
import { reportExpoNotificationTokenResolver } from "./notifications/index.js";
import { createActivityFeedEntryResolver } from "./activityFeeds/mutations.js";
import { activityFeedEntryTypeResolver, activityFeedQueryResolver, activityFeedTypeResolver } from "./activityFeeds/index.js";


export const resolvers: AppResolvers = {
  Query: {
    activityFeed: activityFeedQueryResolver,
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
    createActivityFeedEntry: createActivityFeedEntryResolver,
    createAttachment: createAttachmentMutationResolver,
    updateAttachment: updateAttachmentMutationResolver,
    deleteAttachment: deleteAttachmentMutationResolver,
    createEquipment: createEquipmentMutationResolver,
    updateEquipment: updateEquipmentMutationResolver,
    deleteEquipment: deleteEquipmentMutationResolver,
    reportExpoNotificationToken: reportExpoNotificationTokenResolver,
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

  ActivityFeed: activityFeedTypeResolver,
  ActivityFeedEntry: activityFeedEntryTypeResolver,
  Attachment: attachmentTypeResolver,
  CreateAttachmentPayload: createAttachmentTypeResolver,
  Equipment: equipmentTypeResolver,
  Status: statusTypeResolver,
  Project: projectTypeResolver,
  RecurringTask: recurringTaskTypeResolver,
  RecurringTaskProjection: recurringTaskProjectionTypeResolver,
  Task: taskTypeResolver,
  TaskTransition: taskTransitionTypeResolver,
  User: userTypeResolver,

  ...scalars,
}