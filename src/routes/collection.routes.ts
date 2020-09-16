import { Router } from 'express';

import {
  createCollection,
  getCollectionsAdmin,
  getPublicCollection,
  getPublicCollections,
  getUserCollection,
  getUserCollections,
  removeCollection,
} from '../controllers/collection.controller';
import requireAuth from '../middleware/requireAuth';
import { USER, ADMIN } from '../config/roles';
import authorize from '../middleware/authorize';

const collectionRouter = Router();

/// //////////////////
//
// Admin routes
//
/// //////////////////

collectionRouter
  .route('/admin')
  .get(requireAuth, authorize(ADMIN), getCollectionsAdmin);

/// //////////////////
//
// Public routes
//
/// //////////////////

collectionRouter.route('/public').get(getPublicCollections);

collectionRouter.route('/:collectionId/public').get(getPublicCollection);

/// //////////////////
//
// User routes
//
/// //////////////////

collectionRouter
  .route('/')
  .get(requireAuth, getUserCollections)
  .post(requireAuth, createCollection);

collectionRouter
  .route('/:collectionId')
  .get(requireAuth, authorize(USER), getUserCollection)
  .delete(requireAuth, authorize(USER), removeCollection);

export default collectionRouter;
