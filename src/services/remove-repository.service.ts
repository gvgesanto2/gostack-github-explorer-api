import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Repository from '../models/repository.model';

interface ServiceRequest {
  repositoryId: number;
}

class RemoveRepositoryService {
  public async execute({ repositoryId }: ServiceRequest): Promise<void> {
    const reposRepository = getRepository(Repository);

    const repositoryToRemove = await reposRepository.findOne(repositoryId);

    if (!repositoryToRemove) {
      throw new ErrorResponse('No repository found with this ID', 404);
    }

    await reposRepository.remove(repositoryToRemove);
  }
}

export default RemoveRepositoryService;
