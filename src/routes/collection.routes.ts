import { Router } from 'express';

import {
  createCollection,
  getCollection,
  getCollections,
  getReposFromCollection,
} from '../controllers/collection.controller';

const collectionRouter = Router();

collectionRouter.route('/').get(getCollections).post(createCollection);
collectionRouter.route('/:collectionId').get(getCollection);
collectionRouter
  .route('/:collectionId/repositories')
  .get(getReposFromCollection);

export default collectionRouter;
