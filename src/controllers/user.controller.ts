import { Response } from 'express';
import { getRepository } from 'typeorm';
import asyncHandler from '../middleware/asynHandler';
import User from '../models/user.model';

/// //////////////////
//
// Admin routes controller functions
//
/// //////////////////

// @desc Get all users from database
// @route GET /api/v1/users
// @access Private (Admin)
export const getUsers = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const usersRepository = getRepository(User);

    // Fix later - it's not assignable to select prop in find
    // const propsKeysToExclude = ['password'];
    // const userKeysSelected = selectPropsKeysFromModel(
    //   usersRepository,
    //   propsKeysToExclude,
    // );

    // console.log(userKeysSelected);

    const users = await usersRepository.find({
      select: [
        'id',
        'name',
        'email',
        'role',
        'avatar',
        'created_at',
        'updated_at',
      ],
    });

    res.status(200).json({ success: true, data: users });
  },
);
