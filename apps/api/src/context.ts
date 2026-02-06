import { TaskStatus } from "@mi_casa/gql";
import { config } from "./config";
import { randomUUID } from "node:crypto";

export type AppContext = {
  version: string;
  tasks: { id: string, name: string, status: TaskStatus }[];
}

export const initialContext: AppContext = {
  version: config.VERSION ?? 'unknown',
  tasks: [
    { id: randomUUID(), name: 'Change furnace filter', status: 'READY_TO_BEGIN' },
    { id: randomUUID(), name: 'Install outlet', status: 'READY_TO_BEGIN' },
    { id: randomUUID(), name: 'Cut wood', status: 'READY_TO_BEGIN' },
  ]
}