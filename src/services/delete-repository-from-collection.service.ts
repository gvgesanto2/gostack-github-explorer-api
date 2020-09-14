import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import Repository from '../models/repository.model';
import User from '../models/user.model';
import RepositoryCollectionRelation from '../models/repository-collection-relation.model';

interface ServiceRequest {
  userId: string;
  repositoryId: number;
  collectionId: string;
}

class DeleteRepositoryFromCollectionService {
  public async execute({
    userId,
    repositoryId,
    collectionId,
  }: ServiceRequest): Promise<void> {
    const usersRepository = getRepository(User);
    const collectionsRepository = getRepository(Collection);
    const reposRepository = getRepository(Repository);

    const relationsRepository = getRepository(RepositoryCollectionRelation);

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
    } else if (existingCollection.owner_id !== existingUser.id) {
      throw new ErrorResponse(
        'You are not authorized to complete this action.',
        403,
      );
    }

    if (!existingRepository) {
      throw new ErrorResponse('No repository found with this ID.', 404);
    }

    const relationToDelete = await relationsRepository.findOne({
      where: {
        repository_id: existingRepository.id,
        collection_id: existingCollection.id,
      },
    });

    console.log(relationToDelete);

    if (!relationToDelete) {
      throw new ErrorResponse(
        'This repository does not belong to this collection',
        400,
      );
    }

    await relationsRepository.remove(relationToDelete);
  }
}

export default DeleteRepositoryFromCollectionService;
