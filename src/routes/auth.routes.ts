import { Router } from 'express';

import {
  getMe,
  register,
  signin,
  updateUserPassword,
} from '../controllers/auth.controller';
import authorize from '../middleware/authorize';
import requireAuth from '../middleware/requireAuth';
import { USER } from '../config/roles';

const authRouter = Router();

/// //////////////////
//
// Public routes
//
/// //////////////////

authRouter.route('/register').post(register);
authRouter.post('/signin', signin);

/// //////////////////
//
// User routes
//
/// //////////////////

authRouter.get('/me', requireAuth, getMe);
authRouter.put(
  '/updatepassword',
  requireAuth,
  authorize(USER),
  updateUserPassword,
);

export default authRouter;
