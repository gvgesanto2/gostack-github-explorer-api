import { Router } from 'express';

import { getUsers } from '../controllers/user.controller';

const userRouter = Router();

userRouter.route('/').get(getUsers);

export default userRouter;
