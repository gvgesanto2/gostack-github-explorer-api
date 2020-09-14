import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Repository from '../models/repository.model';

interface ServiceRequest {
  repositoryId: number;
  fieldsToUpdate: {
    is_favorite: boolean;
  };
}

class UpdateRepositoryService {
  public async execute({
    repositoryId,
    fieldsToUpdate: { is_favorite },
  }: ServiceRequest): Promise<Repository> {
    const reposRepository = getRepository(Repository);

    const repositoryToUpdate = await reposRepository.findOne(repositoryId);

    if (!repositoryToUpdate) {
      throw new ErrorResponse('No repository found with this ID.', 404);
    }

    const updatedRepository = {
      ...repositoryToUpdate,
      is_favorite:
        is_favorite === undefined
          ? repositoryToUpdate.is_favorite
          : is_favorite,
    };

    await reposRepository.save(updatedRepository);

    return updatedRepository;
  }
}

export default UpdateRepositoryService;
