import { createSchema, createYoga } from "graphql-yoga";
import { AppContext, createContext } from "./context.js";
import { readFileSync } from "node:fs";
import { resolvers } from "./resolvers/index.js";
import { PrismaClient } from "@mi_casa/db/client";
import { createRequire } from 'node:module';
import { createInlineSigningKeyProvider, extractFromHeader, useJWT } from '@graphql-yoga/plugin-jwt'
import { config } from "../config.js";

const require = createRequire(import.meta.url);

export function buildGqlServer({ url, db }: { url: string, db: PrismaClient }) {
  const typeDefs = readFileSync(require.resolve('@mi_casa/gql/schema.graphql'), 'utf8');
  const schema = createSchema<AppContext>({ typeDefs, resolvers });

  const yoga = createYoga<AppContext>({
    graphqlEndpoint: url,
    schema,
    context: (context) => ({
      ...context,
      ...createContext({ db, _jwt: context._jwt }),
    }),
    plugins: [
      useJWT({
        extendContext: '_jwt',
        signingKeyProviders: [createInlineSigningKeyProvider(config.JWT_SECRET)],
        tokenLookupLocations: [
          extractFromHeader({ name: 'Authorization', prefix: 'Bearer' })
        ],
      })
    ],
  });

  return yoga;
}