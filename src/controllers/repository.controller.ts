import { Response } from 'express';
import { getRepository } from 'typeorm';

import asyncHandler from '../middleware/asynHandler';
import Repository from '../models/repository.model';
import CreateRepositoryService from '../services/create-repository.service';
import RemoveRepositoryService from '../services/remove-repository.service';
import UpdateRepositoryService from '../services/update-repository.service';

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
// @route POST /api/v1/repositories/:collectionId
// @access Private
export const createRepository = asyncHandler(
  async (req, res, _): Promise<Response | void> => {
    const createRepositoryService = new CreateRepositoryService();
    const {
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
    const { collectionId } = req.params;

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
