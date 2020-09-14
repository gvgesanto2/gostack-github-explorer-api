import { getRepository } from 'typeorm';

import { addRepositoryToCollection } from '../utils/repository.utils';
import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import Repository from '../models/repository.model';
import User from '../models/user.model';

interface ServiceRequest {
  userId: string;
  repositoryId: number;
}

class AddRepositoryToFavoritesService {
  public async execute({
    userId,
    repositoryId,
  }: ServiceRequest): Promise<void> {
    const usersRepository = getRepository(User);
    const collectionsRepository = getRepository(Collection);
    const reposRepository = getRepository(Repository);

    const collectionFavoritesTitle = process.env.FAVORITES_COLLECTION_NAME;

    const [
      existingUser,
      collectionFavorites,
      existingRepository,
    ] = await Promise.all([
      usersRepository.findOne(userId),
      collectionsRepository.findOne({
        where: { public_title: `${collectionFavoritesTitle}#${userId}` },
      }),
      reposRepository.findOne(repositoryId),
    ]);

    if (!existingUser) {
      throw new ErrorResponse('No user found with this ID.', 404);
    }

    if (!existingRepository) {
      throw new ErrorResponse('No repository found with this ID.', 404);
    }

    if (!collectionFavorites) {
      throw new ErrorResponse(
        'Server error: The Favorites collection was not found.',
        500,
      );
    }

    await addRepositoryToCollection({
      repository: existingRepository,
      collection: collectionFavorites,
      checkIfRepoExistsInCollection: true,
      addToAllReposCollection: false,
    });
  }
}

export default AddRepositoryToFavoritesService;
