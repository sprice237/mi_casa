import { TaskStatus } from '@mi_casa/db/client'

export type TasksFindManyFilter = {
  status?: TaskStatus;
  equipmentId?: string;
}

export type TasksFindUniqueFilter = {
  id: string;
}

export type TaskCreateData = {
  name: string;
  status: TaskStatus;
  equipmentId: string | null;
  projectId: string | null;
  userId?: string;
}

export type TaskUpdateData = {
  name?: string;
  status?: TaskStatus;
  equipmentId?: string | null;
  projectId?: string | null;
  attachmentIds?: { attach?: readonly string[], detach?: readonly string[] };
  noteIds?: { attach?: readonly string[], detach?: readonly string[] };
  userId?: string;
}