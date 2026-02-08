import { createServer } from 'http';
import { config } from './config';
import { db } from './db';
import { buildGqlServer } from './gql';


async function main() {
  const yoga = buildGqlServer({ db })
  const server = createServer(yoga);

  await new Promise<void>((resolve) => {
    server.listen(config.PORT, resolve);
  })

  console.log(`Server is running on http://localhost:${config.PORT}/graphql`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});