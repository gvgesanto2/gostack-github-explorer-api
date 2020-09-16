import { Response } from 'express';
import { getRepository } from 'typeorm';

import asyncHandler from '../middleware/asynHandler';
import User from '../models/user.model';
import AuthenticateUserService from '../services/authenticate-user.service';
import RegisterUserService from '../services/register-user.service';
import UpdateUserPasswordService from '../services/update-user-password.service';

/// //////////////////
//
// User routes controller functions
//
/// //////////////////

// @desc Get current signed in user
// @route GET /api/v1/auth/me
// @access Private
export const getMe = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const usersRepository = getRepository(User);
    const { id } = req.user;

    const currentUser = await usersRepository.findOne(id);

    const currentUserWithoutPassword = {
      ...currentUser,
      password: undefined,
    };

    res.status(200).json({
      success: true,
      data: currentUserWithoutPassword,
    });
  },
);

// @desc Update password
// @route PUT /api/v1/auth/updatepassword
// @access Private
export const updateUserPassword = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const updateUserPasswordService = new UpdateUserPasswordService();
    const { currentPassword, newPassword } = req.body;

    await updateUserPasswordService.execute({
      user: req.user,
      currentPassword,
      newPassword,
    });

    res.status(200).json({
      success: true,
    });
  },
);

/// //////////////////
//
// Public routes controller functions
//
/// //////////////////

// @desc Register a new user (sign up)
// @route POST /api/v1/auth/register
// @access Public
export const register = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const registerUserService = new RegisterUserService();
    const { name, avatar, role, email, password } = req.body;

    const { user, token } = await registerUserService.execute({
      name,
      avatar,
      role,
      email,
      password,
    });

    const newUserWithoutPassword = {
      ...user,
      password: undefined,
    };

    res.status(200).json({
      success: true,
      data: {
        user: newUserWithoutPassword,
        token,
      },
    });
  },
);

// @desc Sign in user
// @route POST /api/v1/auth/signin
// @access Public
export const signin = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { email, password } = req.body;

    const authenticateUserService = new AuthenticateUserService();

    const { user, token } = await authenticateUserService.execute({
      email,
      password,
    });

    const userWithoutPassword = {
      ...user,
      password: undefined,
    };

    res.status(200).json({
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  },
);
