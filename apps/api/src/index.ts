import { config } from './config.js';
import { db } from './db.js';
import { buildGqlServer } from './gql/index.js';
import fastify from 'fastify';
import multipart from '@fastify/multipart';
import { authPlugin } from './auth/index.js';
import { resourcesPlugin } from './resources/index.js';

async function main() {
  const yoga = buildGqlServer({ url: '/graphql', db })

  const app = fastify({
    logger: true,
    bodyLimit: config.MAX_ATTACHMENT_SIZE_BYTES,
  });

  app.register(multipart);

  app.route({
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: (req, reply) => yoga.handleNodeRequestAndResponse(req, reply)
  });

  if (config.STORAGE_TYPE === 'local') {
    app.register(resourcesPlugin, { prefix: '/resources' });
  }

  app.register(authPlugin, { prefix: '/auth' });

  await app.listen({ host: '0.0.0.0', port: config.PORT });

  console.log(`Server is running`);
  console.log(app.addresses());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});