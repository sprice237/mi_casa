import { createSchema, createYoga } from "graphql-yoga";
import { AppContext, createInitialContext } from "./context.js";
import { readFileSync } from "node:fs";
import { resolvers } from "./resolvers/index.js";
import { PrismaClient } from "@mi_casa/db/client";
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function buildGqlServer({ db }: { db: PrismaClient }) {
  const typeDefs = readFileSync(require.resolve('@mi_casa/gql/schema.graphql'), 'utf8');
  const schema = createSchema<AppContext>({ typeDefs, resolvers });

  const context = createInitialContext({ db });
  const yoga = createYoga<AppContext>({ schema, context });

  return yoga;
}