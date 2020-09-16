import { Router } from 'express';

import { getUsers } from '../controllers/user.controller';
import { ADMIN } from '../config/roles';
import authorize from '../middleware/authorize';
import requireAuth from '../middleware/requireAuth';

const userRouter = Router();

userRouter.route('/').get(requireAuth, authorize(ADMIN), getUsers);

export default userRouter;
