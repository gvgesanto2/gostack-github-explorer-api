import { Router } from 'express';

import {
  createRepository,
  getRepositories,
  updateRepository,
} from '../controllers/repository.controller';

const repositoryRouter = Router();

repositoryRouter.route('/').get(getRepositories).post(createRepository);

repositoryRouter.route('/:repositoryId').put(updateRepository).delete();

export default repositoryRouter;
