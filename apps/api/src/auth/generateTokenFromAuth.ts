import { randomUUID } from 'node:crypto';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppJwt } from '@mi_casa/common';
import { db } from '../db.js';
import { config } from '../config.js';

export async function generateTokenFromAuth({ username, password }: { username: string, password: string }) {
  const user = await db.user.findUnique({
    where: {
      username
    }
  });

  if (!user) {
    return undefined;
  }

  if (!(await compare(password, user.password))) {
    return undefined;
  }

  const payload: AppJwt = {
    jti: randomUUID(),
    sub: user.id,
    casaId: user.casaId
  };

  const token = jwt.sign(payload, config.JWT_SECRET);

  return token;
}