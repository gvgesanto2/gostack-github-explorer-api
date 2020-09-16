import { Response } from 'express';
import { getRepository } from 'typeorm';

import asyncHandler from '../middleware/asynHandler';
import Repository from '../models/repository.model';
import CreateRepositoryService from '../services/create-repository.service';
import RemoveRepositoryService from '../services/remove-repository.service';
import UpdateRepositoryService from '../services/update-repository.service';
import AddRepositoryToCollectionService from '../services/add-repository-to-collection.service';
import DeleteRepositoryFromCollectionService from '../services/delete-repository-from-collection.service';
import RemoveRepositoryFromUserService from '../services/remove-repository-from-user.service';
import Collection from '../models/collection.model';

/// //////////////////
//
// Admin routes controller functions
//
/// //////////////////

// @desc Get all repositories from database
// @route GET /api/v1/repositories/admin
// @access Private (Admin)
export const getRepositoriesAdmin = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const reposRepository = getRepository(Repository);

    const repositories = await reposRepository.find();

    res.status(200).json({ success: true, data: repositories });
  },
);

// @desc Remove a repository from the database
// @route DELETE /api/v1/repositories/:repositoryId/admin
// @access Private (Admin)
export const removeRepositoryAdmin = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const repositoryId = Number(req.params.repositoryId);

    const removeRepositoryService = new RemoveRepositoryService();

    await removeRepositoryService.execute({ repositoryId });

    res.status(200).json({ success: true });
  },
);

/// //////////////////
//
// User routes controller functions
//
/// //////////////////

// @desc Get all repositories of the signed in user
// @route GET /api/v1/repositories
// @access Private
export const getUserRepositories = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const collectionsRepository = getRepository(Collection);
    const { id } = req.user;

    const collectionAllRepos = await collectionsRepository.findOne({
      relations: ['repositories'],
      where: { public_title: `${process.env.ALL_REPOS_COLLECTION_NAME}#${id}` },
    });

    res
      .status(200)
      .json({ success: true, data: collectionAllRepos?.repositories });
  },
);

// @desc Get all the favorite repositories of the signed in user
// @route GET /api/v1/repositories/favorites
// @access Private
export const getUserFavorites = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const collectionsRepository = getRepository(Collection);
    const { id } = req.user;

    const collectionFavorites = await collectionsRepository.findOne({
      relations: ['repositories'],
      where: { public_title: `${process.env.FAVORITES_COLLECTION_NAME}#${id}` },
    });

    res
      .status(200)
      .json({ success: true, data: collectionFavorites?.repositories });
  },
);

// @desc Create a new repository
// @route POST /api/v1/repositories
// @access Private
export const createRepository = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const {
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
    } = req.body;
    const createRepositoryService = new CreateRepositoryService();

    const newRepository = await createRepositoryService.execute({
      user: req.user,
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

    const addRepositoryToCollectionService = new AddRepositoryToCollectionService();

    await addRepositoryToCollectionService.execute({
      repositoryId: Number(repositoryId),
      collectionId,
      user: req.user,
    });

    res.status(200).json({ success: true });
  },
);

// @desc Add repository to the signed in user favorites
// @route POST /api/v1/repositories/:repositoryId/favorites
// @access Private
export const addRepositoryToUserFavorites = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { repositoryId } = req.params;

    const addRepositoryToCollectionService = new AddRepositoryToCollectionService();

    await addRepositoryToCollectionService.execute({
      repositoryId: Number(repositoryId),
      user: req.user,
      collectionTitle: process.env.FAVORITES_COLLECTION_NAME,
    });

    res.status(200).json({ success: true });
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

// @desc Remove a repository of all the collections of the signed in user
// @route DELETE /api/v1/repositories/:repositoryId
// @access Private
export const removeUserRepository = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const repositoryId = Number(req.params.repositoryId);
    const { id } = req.user;

    const removeRepositoryFromUserService = new RemoveRepositoryFromUserService();

    await removeRepositoryFromUserService.execute({
      userId: id,
      repositoryId,
    });

    res.status(200).json({ success: true });
  },
);

// @desc Delete a repository from a collection of the signed in user
// @route DELETE /api/v1/repositories/:repositoryId/collections/:collectionId
// @access Private
export const deleteRepositoryFromCollection = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const { repositoryId, collectionId } = req.params;

    const deleteRepositoryFromCollectionService = new DeleteRepositoryFromCollectionService();

    await deleteRepositoryFromCollectionService.execute({
      repositoryId: Number(repositoryId),
      collectionId,
      user: req.user,
    });

    res.status(200).json({ success: true });
  },
);
