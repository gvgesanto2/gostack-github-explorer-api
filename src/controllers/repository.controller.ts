import { Response } from 'express';
import { getRepository } from 'typeorm';

import asyncHandler from '../middleware/asynHandler';
import Repository from '../models/repository.model';
import CreateRepositoryService from '../services/create-repository.service';
import RemoveRepositoryService from '../services/remove-repository.service';
import UpdateRepositoryService from '../services/update-repository.service';
import AddRepositoryToFavoritesService from '../services/add-repository-to-favorites';
import AddRepositoryToCollectionService from '../services/add-repository-to-collection.service';
import DeleteRepositoryFromCollectionService from '../services/delete-repository-from-collection.service';

// @desc Get all repositories
// @route GET /api/v1/repositories
// @access Private
export const getRepositories = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const reposRepository = getRepository(Repository);

    const repositories = await reposRepository.find();

    res.status(200).json({ success: true, data: repositories });
  },
);

// @desc Create a new repository
// @route POST /api/v1/repositories
// @access Private
export const createRepository = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const createRepositoryService = new CreateRepositoryService();
    const {
      collectionId,
      userId,
      repository: {
        id,
        full_name,
        description,
        owner: { login, avatar_url },
        watchers_count,
        stargazers_count,
        forks_count,
        open_issues_count,
        issues,
        is_favorite,
      },
    } = req.body;

    const newRepository = await createRepositoryService.execute({
      userId,
      collectionId,
      repository: {
        id,
        full_name,
        description,
        owner: { login, avatar_url },
        watchers_count,
        stargazers_count,
        forks_count,
        open_issues_count,
        issues,
        is_favorite,
      },
    });

    res.status(200).json({ success: true, data: newRepository });
  },
);

// @desc Add repository to a certain collection
// @route POST /api/v1/repositories/:repositoryId/collections/:collectionId
// @access Private
export const addRepositoryToCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { repositoryId, collectionId } = req.params;
    const { userId } = req.body;

    const addRepositoryToCollectionService = new AddRepositoryToCollectionService();

    await addRepositoryToCollectionService.execute({
      repositoryId: Number(repositoryId),
      collectionId,
      userId,
    });

    res.status(200).json({ success: true, data: {} });
  },
);

// @desc Add repository to favorites
// @route POST /api/v1/repositories/:repositoryId/favorites
// @access Private
export const addRepositoryToFavorites = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { repositoryId } = req.params;
    const { userId } = req.body;

    const addRepositoryToFavoritesService = new AddRepositoryToFavoritesService();

    await addRepositoryToFavoritesService.execute({
      repositoryId: Number(repositoryId),
      userId,
    });

    res.status(200).json({ success: true, data: {} });
  },
);

// @desc Update certain fields of a repository
// @route PUT /api/v1/repositories/:repositoryId
// @access Private
export const updateRepository = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const repositoryId = Number(req.params.repositoryId);
    const { is_favorite } = req.body;

    const updateRepositoryService = new UpdateRepositoryService();

    const updatedRepository = await updateRepositoryService.execute({
      repositoryId,
      fieldsToUpdate: { is_favorite },
    });

    res.status(200).json({ success: true, data: updatedRepository });
  },
);

// @desc Remove a repository from the database
// @route DELETE /api/v1/repositories/:repositoryId
// @access Private
export const removeRepository = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const repositoryId = Number(req.params.repositoryId);

    const removeRepositoryService = new RemoveRepositoryService();

    await removeRepositoryService.execute({ repositoryId });

    res.status(200).json({ success: true, data: {} });
  },
);

// @desc Delete a repository from a collection
// @route DELETE /api/v1/repositories/:repositoryId/collections/:collectionId
// @access Private
export const deleteRepositoryFromCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { repositoryId, collectionId } = req.params;
    const { userId } = req.body;

    const deleteRepositoryFromCollectionService = new DeleteRepositoryFromCollectionService();

    await deleteRepositoryFromCollectionService.execute({
      repositoryId: Number(repositoryId),
      collectionId,
      userId,
    });

    res.status(200).json({ success: true, data: {} });
  },
);
