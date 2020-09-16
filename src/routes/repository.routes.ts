import { Router } from 'express';

import {
  addRepositoryToCollection,
  addRepositoryToUserFavorites,
  createRepository,
  deleteRepositoryFromCollection,
  getRepositoriesAdmin,
  getUserFavorites,
  getUserRepositories,
  removeRepositoryAdmin,
  removeUserRepository,
  updateRepository,
} from '../controllers/repository.controller';
import requireAuth from '../middleware/requireAuth';
import { USER, ADMIN } from '../config/roles';
import authorize from '../middleware/authorize';

const repositoryRouter = Router();

repositoryRouter.use(requireAuth);

/// //////////////////
//
// Admin routes
//
/// //////////////////

repositoryRouter.route('/admin').get(authorize(ADMIN), getRepositoriesAdmin);
repositoryRouter
  .route('/:repositoryId/admin')
  .delete(authorize(ADMIN), removeRepositoryAdmin);

/// //////////////////
//
// User routes
//
/// //////////////////

repositoryRouter
  .route('/')
  .get(getUserRepositories)
  .post(authorize(USER), createRepository);

repositoryRouter.route('/favorites').get(getUserFavorites);

repositoryRouter
  .route('/:repositoryId')
  .put(updateRepository)
  .delete(removeUserRepository);

repositoryRouter
  .route('/:repositoryId/favorites')
  .post(authorize(USER), addRepositoryToUserFavorites);

repositoryRouter
  .route('/:repositoryId/collections/:collectionId')
  .post(authorize(USER), addRepositoryToCollection)
  .delete(authorize(USER), deleteRepositoryFromCollection);

export default repositoryRouter;
