import { AppResolvers } from "../types.js";

export const projectsQueryResolver: AppResolvers['Query']['projects'] = async (_1, _2, { db }) => {
  const projects = await db.project.findMany();
  return projects;
};

export const projectQueryResolver: AppResolvers['Query']['project'] = async (_, { projectId }, { db }) => {
  const project = await db.project.findUniqueOrThrow({
    where: { id: projectId }
  });

  return project;
};