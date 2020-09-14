import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import RepositoryCollectionRelation from '../models/repository-collection-relation.model';
import Repository from '../models/repository.model';
import CheckRepositoryInCollectionService from './check-repository-in-collection.service';

interface ServiceRequest {
  repository: Repository;
  collection: Collection;
  checkRepositoryInCollection: boolean;
}

class AddRepositoryToCollectionService {
  public async execute({
    repository,
    collection,
    checkRepositoryInCollection,
  }: ServiceRequest): Promise<void> {
    const collectionsRepository = getRepository(Collection);
    const relationsRepository = getRepository(RepositoryCollectionRelation);

    const checkRepositoryInCollectionService = new CheckRepositoryInCollectionService();

    if (checkRepositoryInCollection) {
      if (
        await checkRepositoryInCollectionService.execute({
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
    if (collection.title !== collectionAllReposTitle) {
      // add to all repos
      const collectionAllRepos = await collectionsRepository.findOne({
        where: {
          public_title: `${collectionAllReposTitle}#${collection.owner_id}`,
        },
      });

      if (!collectionAllRepos) {
        throw new ErrorResponse(
          'Server error: The All Repositories collections was not found.',
          500,
        );
      }

      if (
        !(await checkRepositoryInCollectionService.execute({
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
}

export default AddRepositoryToCollectionService;
