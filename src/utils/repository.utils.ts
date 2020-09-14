import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import RepositoryCollectionRelation from '../models/repository-collection-relation.model';
import Repository from '../models/repository.model';

interface AddRepositoryToCollectionArguments {
  repository: Repository;
  collection: Collection;
  checkIfRepoExistsInCollection: boolean;
  addToAllReposCollection: boolean;
}

interface CheckRepositoryInCollectionArguments {
  repository: Repository;
  collection: Collection;
}

export async function checkRepositoryInCollection({
  repository,
  collection,
}: CheckRepositoryInCollectionArguments): Promise<boolean> {
  const relationsRepository = getRepository(RepositoryCollectionRelation);

  const allReposFromCollectionRelations = await relationsRepository.find({
    where: { collection_id: collection.id },
  });

  if (
    allReposFromCollectionRelations.some(
      relation => relation.repository_id === repository.id,
    )
  ) {
    return true;
  }

  return false;
}

export async function addRepositoryToCollection({
  repository,
  collection,
  checkIfRepoExistsInCollection,
  addToAllReposCollection,
}: AddRepositoryToCollectionArguments): Promise<void> {
  const collectionsRepository = getRepository(Collection);
  const relationsRepository = getRepository(RepositoryCollectionRelation);

  if (checkIfRepoExistsInCollection) {
    if (
      await checkRepositoryInCollection({
        collection,
        repository,
      })
    ) {
      throw new ErrorResponse(
        'The collection with this ID already has this repository.',
        400,
      );
    }
  }

  const collectionAllReposTitle = process.env.ALL_REPOS_COLLECTION_NAME;
  if (collection.title !== collectionAllReposTitle && addToAllReposCollection) {
    // add to all repos
    const collectionAllRepos = await collectionsRepository.findOne({
      where: {
        public_title: `${collectionAllReposTitle}#${collection.owner_id}`,
      },
    });

    if (!collectionAllRepos) {
      throw new ErrorResponse(
        'Server error: The All Repositories collection was not found.',
        500,
      );
    }

    if (
      !(await checkRepositoryInCollection({
        collection: collectionAllRepos,
        repository,
      }))
    ) {
      const newRelation = relationsRepository.create({
        collection_id: collectionAllRepos.id,
        repository_id: repository.id,
      });

      await relationsRepository.save(newRelation);
    }
  }

  // add to collection id repo
  const newRelation = relationsRepository.create({
    collection_id: collection.id,
    repository_id: repository.id,
  });

  await relationsRepository.save(newRelation);
}
