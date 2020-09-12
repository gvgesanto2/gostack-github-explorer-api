import { Router } from 'express';

import {
  createRepository,
  getRepositories,
} from '../controllers/repository.controller';

const repositoryRouter = Router();

repositoryRouter.route('/').get(getRepositories).post(createRepository);

export default repositoryRouter;
