import { Response } from 'express';

import asyncHandler from '../middleware/asynHandler';
import CreateUserService from '../services/create-user.service';

// @desc Register a new user (sign up)
// @route POST /api/v1/auth/register
// @access Public
export const register = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const createUserService = new CreateUserService();
    const { name, avatar, email, password } = req.body;

    const newUser = await createUserService.execute({
      name,
      avatar,
      email,
      password,
    });

    const newUserWithoutPassword = {
      ...newUser,
      password: undefined,
    };

    res.status(200).json({ success: true, data: newUserWithoutPassword });
  },
);
