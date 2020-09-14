import { Response } from 'express';
import { getRepository } from 'typeorm';
import asyncHandler from '../middleware/asynHandler';
import User from '../models/user.model';
// import CreateUserService from '../services/create-user.service';

// @desc Get all users
// @route GET /api/v1/users
// @access Private (Admin)
export const getUsers = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const usersRepository = getRepository(User);

    const users = await usersRepository.find({
      select: ['id', 'name', 'email', 'avatar', 'created_at', 'updated_at'],
    });

    res.status(200).json({ success: true, data: users });
  },
);
