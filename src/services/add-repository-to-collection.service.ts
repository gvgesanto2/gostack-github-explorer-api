import { getRepository } from 'typeorm';
import ErrorResponse from '../errors/ErrorResponse';

import { addRepositoryToCollection } from '../utils/repository.utils';
import Collection from '../models/collection.model';
import Repository from '../models/repository.model';
import User from '../models/user.model';

interface ServiceRequest {
  userId: string;
  repositoryId: number;
  collectionId: string;
}

class AddRepositoryToCollectionService {
  public async execute({
    userId,
    repositoryId,
    collectionId,
  }: ServiceRequest): Promise<void> {
    const usersRepository = getRepository(User);
    const collectionsRepository = getRepository(Collection);
    const reposRepository = getRepository(Repository);

    const [
      existingUser,
      existingCollection,
      existingRepository,
    ] = await Promise.all([
      usersRepository.findOne(userId),
      collectionsRepository.findOne(collectionId),
      reposRepository.findOne(repositoryId),
    ]);

    if (!existingUser) {
      throw new ErrorResponse('No user found with this ID.', 404);
    }

    if (!existingCollection) {
      throw new ErrorResponse('No collection found with this ID', 404);
    } else if (existingCollection.owner_id !== userId) {
      throw new ErrorResponse(
        'You are not authorized to complete this action.',
        403,
      );
    }

    if (!existingRepository) {
      throw new ErrorResponse('No repository found with this ID.', 404);
    }

    await addRepositoryToCollection({
      collection: existingCollection,
      repository: existingRepository,
      checkIfRepoExistsInCollection: true,
      addToAllReposCollection: false,
    });
  }
}

export default AddRepositoryToCollectionService;
