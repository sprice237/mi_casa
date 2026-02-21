import { AppResolvers } from "../types.js";
import { Prisma } from "@mi_casa/db/client";

export const createProjectMutationResolver: AppResolvers['Mutation']['createProject'] = async (_, { input }, { db }) => {
  const project = await db.project.create({
    data: {
      name: input.name,
    }
  });
  return project;
};

export const updateProjectMutationResolver: AppResolvers['Mutation']['updateProject'] = async (_, { projectId, input }, { db }) => {
  const project = await db.project.update({
    where: { id: projectId },
    data: {
      name: input.name ?? Prisma.skip,
    }
  });

  return project;
};

export const deleteProjectMutationResolver: AppResolvers['Mutation']['deleteProject'] = async (_, { projectId }, { db }) => {
  await db.project.delete({
    where: { id: projectId },
  });

  return true;
};