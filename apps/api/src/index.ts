import { config } from './config.js';
import { db } from './db.js';
import { buildGqlServer } from './gql/index.js';
import fastify from 'fastify';
import { authPlugin } from './auth/index.js';

async function main() {
  const yoga = buildGqlServer({ url: '/graphql', db })

  const app = fastify({
    logger: true
  });

  app.route({
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: (req, reply) => yoga.handleNodeRequestAndResponse(req, reply)
  });

  app.register(authPlugin, { prefix: '/auth' });

  await app.listen({ host: '0.0.0.0', port: config.PORT });

  console.log(`Server is running`);
  console.log(app.addresses());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});