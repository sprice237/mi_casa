import { TaskStatus } from "@mi_casa/gql";

export type AppContext = {
  version: string;
  tasks: { id: string, name: string, status: TaskStatus }[];
}