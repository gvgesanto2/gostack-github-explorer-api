import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Repository from '../models/repository.model';

class CreateRepositoryService {
  public async execute({
    id,
    full_name,
    description,
    owner: { login, avatar_url },
    watchers_count,
    stargazers_count,
    forks_count,
    open_issues_count,
    issues,
    isFavorite,
  }: Repository): Promise<Repository> {
    const reposRepository = getRepository(Repository);

    const existingRepository = await reposRepository.findOne({
      where: { full_name },
    });

    if (existingRepository) {
      throw new ErrorResponse(
        'This repository name is already been used.',
        400,
      );
    }

    const newRepository = reposRepository.create({
      id,
      full_name,
      description,
      owner: { login, avatar_url },
      watchers_count,
      stargazers_count,
      forks_count,
      open_issues_count,
      issues,
      isFavorite: isFavorite || false,
    });

    await reposRepository.save(newRepository);

    return newRepository;
  }
}

export default CreateRepositoryService;
