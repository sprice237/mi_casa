import { readFileSync } from 'node:fs'
import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';
import { Resolvers } from '@mi_casa/gql'
import { config } from './config';
import { AppContext } from './context';

const typeDefs = readFileSync(require.resolve('@mi_casa/gql/schema.graphql'), 'utf8');

const resolvers: Resolvers<AppContext> = {
  Query: {
    status() {
      return {
        version: config.VERSION ?? 'unknown'
      }
    }
  },
  Status: {
    version: (parent) => parent.version
  }
}

async function main() {
  const schema = createSchema<AppContext>({ typeDefs, resolvers });
  const context = () => ({ version: config.VERSION ?? 'unknown' } satisfies AppContext);
  const yoga = createYoga<AppContext>({ schema, context });
  const server = createServer(yoga);


  const port = config.PORT;
  await new Promise<void>((resolve) => {
    server.listen(port, resolve);
  })

  console.log(`Server is running on http://localhost:${port}/graphql`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});