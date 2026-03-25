import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { register, UsernameAlreadyExistsError } from "./register.js";
import { generateTokenFromAuth } from "./generateTokenFromAuth.js";

export const authPlugin: FastifyPluginAsync = async (app) => {
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

    try {
      return await register(parseResult.data)
    } catch (e) {
      if (e instanceof UsernameAlreadyExistsError) {
        reply.code(409).send();
      } else {
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

    const token = await generateTokenFromAuth(parseResult.data);

    if (!token) {
      reply.code(401).send();
    } else {
      return { token }
    }
  })
}