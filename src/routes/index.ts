import { Router } from 'express';

import repositoryRouter from './repository.routes';

const routes = Router();

routes.use('/repositories', repositoryRouter);

export default routes;
