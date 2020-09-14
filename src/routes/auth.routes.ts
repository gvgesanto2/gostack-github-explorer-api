import { Router } from 'express';

import { register } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.route('/register').post(register);

export default authRouter;
