import fs from 'node:fs/promises';
import { FastifyPluginAsync } from "fastify";
import { config } from "../config.js";
import path from "node:path";

export const resourcesPlugin: FastifyPluginAsync = async (app) => {
  if (config.STORAGE_TYPE !== 'local') {
    throw new Error('cannot use resources plugin if storage type is not local')
  }
  const storageLocalDir = config.STORAGE_LOCAL_DIR;

  app.get('/*', async (req, reply) => {
    const resourceKey = typeof req.params === 'object' && !!req.params && '*' in req.params ? req.params['*'] : undefined;

    if (!resourceKey) {
      reply.code(400).send();
      return;
    }

    const resourceKeyNormalized = path.normalize(`/${resourceKey}`);
    const localPath = `${storageLocalDir}${resourceKeyNormalized}`;

    try {
      const fileBuffer = await fs.readFile(localPath);
      reply.type('image/jpeg');
      reply.send(fileBuffer);
    } catch (err) {
      console.error(err);
      reply.code(400).send();
    }
  })

  app.post('/*', async (req, reply) => {
    const resourceKey = typeof req.params === 'object' && !!req.params && '*' in req.params ? req.params['*'] : undefined;

    if (!resourceKey) {
      reply.code(400).send();
      return;
    }


    const fileData = await req.file();
    if (!fileData) {
      reply.code(400).send();
      return;
    }

    const resourceKeyNormalized = path.normalize(`/${resourceKey}`);
    const localPath = `${storageLocalDir}${resourceKeyNormalized}`;
    const localDirectoryPath = path.dirname(localPath);

    await fs.mkdir(localDirectoryPath, { recursive: true });

    const fileBuffer = await fileData.toBuffer();
    await fs.writeFile(localPath, fileBuffer);

    reply.code(201).send();
  })
}
