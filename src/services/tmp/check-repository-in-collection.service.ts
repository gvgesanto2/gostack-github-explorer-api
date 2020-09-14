import { getRepository } from 'typeorm';

import Collection from '../../models/collection.model';
import RepositoryCollectionRelation from '../../models/repository-collection-relation.model';
import Repository from '../../models/repository.model';

interface ServiceRequest {
  repository: Repository;
  collection: Collection;
}

class CheckRepositoryInCollectionService {
  public async execute({
    repository,
    collection,
  }: ServiceRequest): Promise<boolean> {
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
}

export default CheckRepositoryInCollectionService;

// throw new ErrorResponse(
//   'The collection with this ID already has this repository.',
//   400,
// );
