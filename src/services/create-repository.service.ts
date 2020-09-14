import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import Repository from '../models/repository.model';
import User from '../models/user.model';
import AddRepositoryToCollectionService from './add-repository-to-collection.service';

interface ServiceRequest {
  userId: string;
  collectionId: string;
  repository: Omit<Repository, 'created_at' | 'updated_at'>;
}

class CreateRepositoryService {
  public async execute({
    userId,
    collectionId,
    repository: {
      id,
      full_name,
      description,
      owner: { login, avatar_url },
      watchers_count,
      stargazers_count,
      forks_count,
      open_issues_count,
      issues,
      is_favorite,
    },
  }: ServiceRequest): Promise<Repository> {
    const usersRepository = getRepository(User);
    const collectionsRepository = getRepository(Collection);
    const reposRepository = getRepository(Repository);

    const addRepositoryToCollectionService = new AddRepositoryToCollectionService();

    const [
      existingUser,
      existingCollection,
      existingRepository,
    ] = await Promise.all([
      usersRepository.findOne(userId),
      collectionsRepository.findOne(collectionId),
      reposRepository.findOne({
        where: [{ full_name }, { id }],
      }),
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

    if (existingRepository) {
      await addRepositoryToCollectionService.execute({
        repository: existingRepository,
        collection: existingCollection,
        checkRepositoryInCollection: true,
      });

      return existingRepository;
    }

    const newRepository = reposRepository.create({
      id,
      full_name,
      description,
      owner: { login, avatar_url },
      watchers_count,
      stargazers_count,
      forks_count,
      open_issues_count,
      issues,
      is_favorite: is_favorite || false,
    });

    await reposRepository.save(newRepository);

    await addRepositoryToCollectionService.execute({
      repository: newRepository,
      collection: existingCollection,
      checkRepositoryInCollection: false,
    });

    return newRepository;
  }
}

export default CreateRepositoryService;
