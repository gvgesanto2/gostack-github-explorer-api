import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import ErrorResponse from '../errors/ErrorResponse';
import User from '../models/user.model';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('JWT bearer token is missing. Please, sign in.');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, `${process.env.JWT_SECRET}`);

    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    } as User;

    return next();
  } catch (error) {
    throw new ErrorResponse('You are not authorized to access this route', 401);
  }
};

export default requireAuth;
