import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import Repository from '../models/repository.model';
import RepositoryCollectionRelation from '../models/repository-collection-relation.model';
import RemoveRepositoryFromUserService from './remove-repository-from-user.service';
import User from '../models/user.model';
import { roles } from '../config/roles';

interface ServiceRequest {
  user: User;
  repositoryId: number;
  collectionId: string;
}

class DeleteRepositoryFromCollectionService {
  public async execute({
    user: { id, role },
    repositoryId,
    collectionId,
  }: ServiceRequest): Promise<void> {
    const collectionsRepository = getRepository(Collection);
    const reposRepository = getRepository(Repository);
    const relationsRepository = getRepository(RepositoryCollectionRelation);

    const existingCollection = await collectionsRepository.findOne(
      collectionId,
    );

    if (!existingCollection) {
      throw new ErrorResponse('No collection found with this ID', 404);
    } else if (existingCollection.owner_id !== id && role !== roles.ADMIN) {
      throw new ErrorResponse(
        'You are not authorized to complete this action.',
        403,
      );
    }

    if (existingCollection.title === process.env.ALL_REPOS_COLLECTION_NAME) {
      const removeRepositoryFromUserService = new RemoveRepositoryFromUserService();

      await removeRepositoryFromUserService.execute({
        userId: id,
        repositoryId,
      });

      return;
    }

    const existingRepository = await reposRepository.findOne(repositoryId);

    if (!existingRepository) {
      throw new ErrorResponse('No repository found with this ID.', 404);
    }

    const relationToDelete = await relationsRepository.findOne({
      where: {
        repository_id: existingRepository.id,
        collection_id: existingCollection.id,
      },
    });

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
