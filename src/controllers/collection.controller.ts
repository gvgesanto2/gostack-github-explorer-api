import { Response } from 'express';
import { getRepository, In, Not } from 'typeorm';

import asyncHandler from '../middleware/asynHandler';
import Collection from '../models/collection.model';
import CreateCollectionService from '../services/create-collection.service';
import GetCollectionWithReposService from '../services/get-collection-with-repos.service';
import RemoveCollectionService from '../services/remove-collection.service';

/// //////////////////
//
// Admin routes controller functions
//
/// //////////////////

// @desc Get all collections from database
// @route GET /api/v1/collections/admin
// @access Private (Admin)
export const getCollectionsAdmin = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const collectionsRepository = getRepository(Collection);

    const collections = await collectionsRepository.find({
      relations: ['repositories'],
    });

    res.status(200).json({ success: true, data: collections });
  },
);

/// //////////////////
//
// User routes controller functions
//
/// //////////////////

// @desc Get all collections of the signed in user
// @route GET /api/v1/collections
// @access Private
export const getUserCollections = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const collectionsRepository = getRepository(Collection);
    const { id } = req.user;
    const {
      ALL_REPOS_COLLECTION_NAME,
      FAVORITES_COLLECTION_NAME,
    } = process.env;

    const specialCollections = await collectionsRepository.find({
      relations: ['repositories'],
      where: {
        owner_id: id,
        public_title: In([
          `${ALL_REPOS_COLLECTION_NAME}#${id}`,
          `${FAVORITES_COLLECTION_NAME}#${id}`,
        ]),
      },
    });

    const userCollections = await collectionsRepository.find({
      relations: ['repositories'],
      where: {
        owner_id: id,
        public_title: Not(
          In([
            `${ALL_REPOS_COLLECTION_NAME}#${id}`,
            `${FAVORITES_COLLECTION_NAME}#${id}`,
          ]),
        ),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        specialCollections,
        userCollections,
      },
    });
  },
);

// @desc Get a single collection of the signed in user
// @route GET /api/v1/collections/:collectionId
// @access Private
export const getUserCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { collectionId } = req.params;
    const getCollectionWithReposService = new GetCollectionWithReposService();

    const collection = await getCollectionWithReposService.execute({
      user: req.user,
      collectionId,
    });

    res.status(200).json({ success: true, data: collection });
  },
);

// @desc Create a new collection
// @route POST /api/v1/collections
// @access Private
export const createCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const createCollectionService = new CreateCollectionService();
    const { id } = req.user;
    const { is_public, public_title, title, description, image_url } = req.body;

    const newCollection = await createCollectionService.execute({
      owner_id: id,
      is_public,
      public_title,
      title,
      description,
      image_url,
    });

    res.status(200).json({ success: true, data: newCollection });
  },
);

// @desc Remove collection from database
// @route DELETE /api/v1/collections/:collectionId
// @access Private
export const removeCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const removeCollectionService = new RemoveCollectionService();
    const { collectionId } = req.params;

    await removeCollectionService.execute({
      user: req.user,
      collectionId,
    });

    res.status(200).json({ success: true });
  },
);

/// //////////////////
//
// Public routes controller functions
//
/// //////////////////

// @desc Get all public collections from database
// @route GET /api/v1/collections/public
// @access Public
export const getPublicCollections = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const collectionsRepository = getRepository(Collection);

    const collections = await collectionsRepository.find({
      relations: ['repositories'],
      where: { is_public: true },
    });

    res.status(200).json({ success: true, data: collections });
  },
);

// @desc Get a single public collection from database
// @route GET /api/v1/collections/:collectionId/public
// @access Public
export const getPublicCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { collectionId } = req.params;
    const getCollectionWithReposService = new GetCollectionWithReposService();

    const collection = await getCollectionWithReposService.execute({
      collectionId,
    });

    res.status(200).json({ success: true, data: collection });
  },
);
