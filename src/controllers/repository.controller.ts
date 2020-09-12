import { Response } from 'express';
import { getRepository } from 'typeorm';

import asyncHandler from '../middleware/asynHandler';
import Repository from '../models/repository.model';
import CreateRepositoryService from '../services/create-repository.service';

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
    const {
      id,
      full_name,
      description,
      owner,
      watchers_count,
      stargazers_count,
      forks_count,
      open_issues_count,
      issues,
    } = req.body;

    const createRepositoryService = new CreateRepositoryService();

    const newRepository = await createRepositoryService.execute({
      id,
      full_name,
      description,
      owner,
      watchers_count,
      stargazers_count,
      forks_count,
      open_issues_count,
      issues,
    });

    res.status(200).json({ success: true, data: newRepository });
  },
);
