import { getRepository } from 'typeorm';
import ErrorResponse from '../errors/ErrorResponse';

import { addRepositoryToCollection } from '../utils/repository.utils';
import Collection from '../models/collection.model';
import Repository from '../models/repository.model';
import User from '../models/user.model';
import { roles } from '../config/roles';

interface ServiceRequest {
  user: User;
  repositoryId: number;
  collectionId?: string;
  collectionTitle?: string;
}

class AddRepositoryToCollectionService {
  public async execute({
    user: { role, id },
    repositoryId,
    collectionId,
    collectionTitle,
  }: ServiceRequest): Promise<void> {
    const collectionsRepository = getRepository(Collection);
    const reposRepository = getRepository(Repository);

    const query = collectionId
      ? { where: { id: collectionId } }
      : { where: { public_title: `${collectionTitle}#${id}` } };

    const [existingCollection, existingRepository] = await Promise.all([
      collectionsRepository.findOne(query),
      reposRepository.findOne(repositoryId),
    ]);

    if (!existingCollection) {
      throw new ErrorResponse('No collection found.', 404);
    } else if (existingCollection.owner_id !== id && role !== roles.ADMIN) {
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
      addToAllReposCollection: true,
    });
  }
}

export default AddRepositoryToCollectionService;
