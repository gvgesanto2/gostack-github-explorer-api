import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import RepositoryCollectionRelation from '../models/repository-collection-relation.model';
import Repository from '../models/repository.model';
import User from '../models/user.model';

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

    const relationsRepository = getRepository(RepositoryCollectionRelation);

    const [
      existingUser,
      existingCollection,
      existingRepository,
    ] = await Promise.all([
      usersRepository.findOne(userId),
      collectionsRepository.findOne(collectionId),
      reposRepository.findOne({
        where: { full_name },
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
      const relationsWithCollectionId = await relationsRepository.find({
        where: { collection_id: collectionId },
      });

      if (
        relationsWithCollectionId.some(
          relation => relation.repository_id === existingRepository.id,
        )
      ) {
        throw new ErrorResponse(
          'This repository belongs to this collection already',
          400,
        );
      }

      const collectionAllReposTitle = process.env.ALL_REPOS_COLLECTION_NAME;
      if (existingCollection.title !== collectionAllReposTitle) {
        // add to all repos
        const collectionAllRepos = await collectionsRepository.findOne({
          where: { public_title: `${collectionAllReposTitle}#${userId}` },
        });

        if (!collectionAllRepos) {
          throw new ErrorResponse(
            'Server error: The All Repositories collections was not found.',
            500,
          );
        }

        const newRelation = relationsRepository.create({
          collection_id: collectionAllRepos.id,
          repository_id: existingRepository.id,
        });

        await relationsRepository.save(newRelation);
      }

      // add to collection id repo
      const newRelation = relationsRepository.create({
        collection_id: existingCollection.id,
        repository_id: existingRepository.id,
      });

      await relationsRepository.save(newRelation);

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

    const newRelation = relationsRepository.create({
      collection_id: existingCollection.id,
      repository_id: newRepository.id,
    });

    await relationsRepository.save(newRelation);

    return newRepository;
  }
}

export default CreateRepositoryService;
