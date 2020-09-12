import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Repository from '../models/repository.model';

interface ServiceRequest {
  repositoryId: number;
  fieldsToUpdate: {
    isFavorite: boolean;
  };
}

class UpdateRepositoryService {
  public async execute({
    repositoryId,
    fieldsToUpdate: { isFavorite },
  }: ServiceRequest): Promise<Repository> {
    const reposRepository = getRepository(Repository);

    const repository = await reposRepository.findOne(repositoryId);

    if (!repository) {
      throw new ErrorResponse('No repository found with this ID.', 400);
    }

    const updatedRepository = {
      ...repository,
      isFavorite: isFavorite === undefined ? repository.isFavorite : isFavorite,
    };

    await reposRepository.save(updatedRepository);

    return updatedRepository;
  }
}

export default UpdateRepositoryService;
