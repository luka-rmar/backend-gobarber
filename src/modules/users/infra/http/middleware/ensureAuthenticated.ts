import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppErros from '../../../../../shared/errors/AppErros';
import authConfig from '../../../../../config/auth';

interface Payload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppErros('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.sercret);
    const { sub } = decoded as Payload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppErros('Invalid JWT token ', 401);
  }
}
