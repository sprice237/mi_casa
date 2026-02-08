import { readFileSync } from 'node:fs'
import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';
import { config } from './config';
import { AppContext, createInitialContext } from './context';
import { resolvers } from './resolvers';
import { PrismaClient } from '@mi_casa/db/client';
import { PrismaPg } from '@mi_casa/db/adapter';

const typeDefs = readFileSync(require.resolve('@mi_casa/gql/schema.graphql'), 'utf8');

async function main() {
  const schema = createSchema<AppContext>({ typeDefs, resolvers });
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: config.DATABASE_URL })
  });

  const context = createInitialContext(db);
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