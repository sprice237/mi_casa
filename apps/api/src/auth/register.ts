import { randomUUID } from 'node:crypto';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppJwt } from '@mi_casa/common';
import { Prisma } from '@mi_casa/db/client';
import { db } from '../db.js';
import { config } from '../config.js';

export class UsernameAlreadyExistsError extends Error { }

export async function register({ username, password }: { username: string, password: string }) {
  const passwordHash = await hash(password, 10);

  try {
    const user = await db.user.create({
      data: {
        username,
        password: passwordHash,
        casa: {
          create: {
            name: `${username}'s Casa`
          }
        }
      }
    });

    const payload: AppJwt = {
      jti: randomUUID(),
      sub: user.id,
      casaId: user.casaId,
    };

    const token = jwt.sign(payload, config.JWT_SECRET);

    return {
      token
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        throw new UsernameAlreadyExistsError();
      } else {
        // Handle other known Prisma errors
        throw e;
      }
    } else {
      // Handle unknown errors
      throw e;
    }
  }
}