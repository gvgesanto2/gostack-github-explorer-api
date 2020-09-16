import { getRepository } from 'typeorm';
import { roles } from '../config/roles';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import Repository from '../models/repository.model';
import User from '../models/user.model';
import { addRepositoryToCollection } from '../utils/repository.utils';

interface ServiceRequest {
  user: User;
  collectionId: string;
  repository: Omit<Repository, 'created_at' | 'updated_at'>;
}

class CreateRepositoryService {
  public async execute({
    user,
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
    const collectionsRepository = getRepository(Collection);
    const reposRepository = getRepository(Repository);

    const [existingCollection, existingRepository] = await Promise.all([
      collectionsRepository.findOne(collectionId),
      reposRepository.findOne({
        where: [{ full_name }, { id }],
      }),
    ]);

    if (!existingCollection) {
      throw new ErrorResponse('No collection found with this ID', 404);
    } else if (
      existingCollection.owner_id !== user.id &&
      user.role !== roles.ADMIN
    ) {
      throw new ErrorResponse(
        'You are not authorized to complete this action.',
        403,
      );
    }

    if (existingRepository) {
      await addRepositoryToCollection({
        repository: existingRepository,
        collection: existingCollection,
        checkIfRepoExistsInCollection: true,
        addToAllReposCollection: true,
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

    await addRepositoryToCollection({
      repository: newRepository,
      collection: existingCollection,
      checkIfRepoExistsInCollection: false,
      addToAllReposCollection: true,
    });

    return newRepository;
  }
}

export default CreateRepositoryService;
