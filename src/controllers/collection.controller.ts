import { Response } from 'express';
import { getRepository } from 'typeorm';

import asyncHandler from '../middleware/asynHandler';
import Collection from '../models/collection.model';
import RepositoryCollectionRelation from '../models/repository-collection-relation.model';
import CreateCollectionService from '../services/create-collection.service';

// @desc Get all collections
// @route GET /api/v1/collections
// @access Private
export const getCollections = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const collectionsRepository = getRepository(Collection);

    const collections = await collectionsRepository.find();

    res.status(200).json({ success: true, data: collections });
  },
);

// @desc Get all repositories from collection
// @route GET /api/v1/collections/:collectionId/repositories
// @access Private
export const getReposFromCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { collectionId } = req.params;
    const relationsRepository = getRepository(RepositoryCollectionRelation);

    const repositoriesIds = await relationsRepository.find({
      select: ['repository_id'],
      where: { collection_id: collectionId },
    });

    res.status(200).json({ success: true, data: repositoriesIds });
  },
);

// @desc Create a new collection
// @route POST /api/v1/collections
// @access Private
export const createCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const createCollectionService = new CreateCollectionService();
    const {
      owner_id,
      is_public,
      public_title,
      title,
      description,
      image_url,
    } = req.body;

    const newCollection = await createCollectionService.execute({
      owner_id,
      is_public,
      public_title,
      title,
      description,
      image_url,
    });

    res.status(200).json({ success: true, data: newCollection });
  },
);
