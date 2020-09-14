import { Router } from 'express';

import {
  createCollection,
  getCollections,
  getReposFromCollection,
} from '../controllers/collection.controller';

const collectionRouter = Router();

collectionRouter.route('/').get(getCollections).post(createCollection);
collectionRouter
  .route('/:collectionId/repositories')
  .get(getReposFromCollection);

export default collectionRouter;
