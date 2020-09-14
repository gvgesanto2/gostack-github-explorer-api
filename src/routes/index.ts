import { Router } from 'express';

import repositoryRouter from './repository.routes';
import collectionRouter from './collection.routes';
import userRouter from './user.routes';
import authRouter from './auth.routes';

const routes = Router();

routes.use('/repositories', repositoryRouter);
routes.use('/collections', collectionRouter);
routes.use('/users', userRouter);
routes.use('/auth', authRouter);

export default routes;
