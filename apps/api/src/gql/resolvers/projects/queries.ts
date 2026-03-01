import { AppResolvers } from "../types.js";

export const projectsQueryResolver: AppResolvers['Query']['projects'] = async (_1, _2, { db, casaId }) => {
  const projects = await db.project.findMany({
    where: {
      casaId
    }
  });
  return projects;
};

export const projectQueryResolver: AppResolvers['Query']['project'] = async (_, { projectId }, { db, casaId }) => {
  const project = await db.project.findUniqueOrThrow({
    where: { id: projectId, casaId }
  });

  return project;
};