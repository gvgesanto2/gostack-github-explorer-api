import { Router } from 'express';

import {
  addRepositoryToCollection,
  addRepositoryToFavorites,
  createRepository,
  deleteRepositoryFromCollection,
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

repositoryRouter
  .route('/:repositoryId/collections/:collectionId')
  .post(addRepositoryToCollection)
  .delete(deleteRepositoryFromCollection);

repositoryRouter
  .route('/:repositoryId/favorites')
  .post(addRepositoryToFavorites);

export default repositoryRouter;
