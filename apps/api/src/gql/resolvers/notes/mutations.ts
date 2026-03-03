import { AppResolvers } from "../types.js";
import { Prisma } from "@mi_casa/db/client";

export const createNoteMutationResolver: AppResolvers['Mutation']['createNote'] = async (_, { input }, { db, casaId }) => {
  const note = await db.note.create({
    data: {
      content: input.content,
      casaId
    }
  });
  return note;
};

export const updateNoteMutationResolver: AppResolvers['Mutation']['updateNote'] = async (_, { noteId, input }, { db, casaId }) => {
  const note = await db.note.update({
    where: { id: noteId, casaId },
    data: {
      content: input.content ?? Prisma.skip,
    }
  });

  return note;
};

export const deleteNoteMutationResolver: AppResolvers['Mutation']['deleteNote'] = async (_, { noteId }, { db, casaId }) => {
  await db.note.delete({
    where: { id: noteId, casaId },
  });

  return true;
};
