import { getRepository, In } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import RepositoryCollectionRelation from '../models/repository-collection-relation.model';

interface ServiceRequest {
  userId: string;
  repositoryId: number;
}

class RemoveRepositoryFromUserService {
  public async execute({
    userId,
    repositoryId,
  }: ServiceRequest): Promise<void> {
    const collectionsRepository = getRepository(Collection);
    const relationsRepository = getRepository(RepositoryCollectionRelation);

    const collectionsFromUser = await collectionsRepository.find({
      select: ['id'],
      where: { owner_id: userId },
    });

    const collectionsIdsFromUser = collectionsFromUser.map(
      collection => collection.id,
    );

    if (!collectionsIdsFromUser || collectionsIdsFromUser.length === 0) {
      throw new ErrorResponse('No user found with this ID', 404);
    }

    const relationsToRemove = await relationsRepository.find({
      where: {
        collection_id: In(collectionsIdsFromUser),
        repository_id: repositoryId,
      },
    });

    if (!relationsToRemove || relationsToRemove.length === 0) {
      throw new ErrorResponse(
        'No repository found with this ID in your collections',
        404,
      );
    }

    await relationsRepository.remove(relationsToRemove);
  }
}

export default RemoveRepositoryFromUserService;
