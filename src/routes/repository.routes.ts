import { Router } from 'express';

import {
  createRepository,
  getRepositories,
  removeRepository,
  updateRepository,
} from '../controllers/repository.controller';

const repositoryRouter = Router();

repositoryRouter.route('/').get(getRepositories).post(createRepository);

repositoryRouter
  .route('/:repositoryId')
  .put(updateRepository)
  .delete(removeRepository);

export default repositoryRouter;
