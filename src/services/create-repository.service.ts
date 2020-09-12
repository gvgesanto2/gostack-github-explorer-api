import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Repository from '../models/repository.model';

class CreateRepositoryService {
  public async execute(repository: Repository): Promise<Repository> {
    const { full_name } = repository;
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

    const newRepository = reposRepository.create(repository);

    await reposRepository.save(newRepository);

    return newRepository;
  }
}

export default CreateRepositoryService;
