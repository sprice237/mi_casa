import fastify from 'fastify'
import { config } from './config.js';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from './db.js';
import { compare, hash } from 'bcrypt';
import { Prisma } from '@mi_casa/db/client';

export function init() {
  const app = fastify({
    logger: true
  });

  app.post('/register', async (req, reply) => {
    const parseResult = z
      .object({
        username: z.string(),
        password: z.string()
      })
      .safeParse(req.body);

    if (!parseResult.success) {
      reply.code(400).send();
      return;
    }

    const { username, password } = parseResult.data;

    const passwordHash = await hash(password, 10);


    try {
      const user = await db.user.create({
        data: {
          username,
          password: passwordHash
        }
      });

      const payload = { sub: user.id };

      const token = jwt.sign(payload, config.JWT_SECRET);

      return {
        token
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          reply.code(409).send();
        } else {
          // Handle other known Prisma errors
          throw e;
        }
      } else {
        // Handle unknown errors
        throw e;
      }
    }
  });

  app.post('/generate-token-from-auth', async (req, reply) => {
    const parseResult = z
      .object({
        username: z.string(),
        password: z.string()
      })
      .safeParse(req.body);

    if (!parseResult.success) {
      reply.code(400).send();
      return;
    }

    const { username, password } = parseResult.data;

    const user = await db.user.findUnique({
      where: {
        username
      }
    });

    if (!user) {
      reply.code(401).send();
      return;
    }

    if (!(await compare(password, user.password))) {
      reply.code(401).send();
      return;
    }

    const payload = { sub: user.id };

    const token = jwt.sign(payload, config.JWT_SECRET);

    return {
      token
    }
  });

  return app;
}
