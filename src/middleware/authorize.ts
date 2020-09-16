import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { UserRoles } from '../config/roles';
import ErrorResponse from '../errors/ErrorResponse';
import User from '../models/user.model';

const authorize = (...roles: UserRoles[]) => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const usersRepository = getRepository(User);
    const { id } = req.user;

    const existingUser = await usersRepository.findOne(id);

    if (!existingUser) {
      return next(new ErrorResponse('No user found with this ID.', 404));
    }

    const { role } = existingUser;
    if (!roles.includes(role) && role !== 'admin') {
      return next(
        new ErrorResponse('You are not authorized to access this route', 403),
      );
    }

    req.user = existingUser;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default authorize;
