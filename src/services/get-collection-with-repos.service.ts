import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';

interface ServiceRequest {
  collectionId: string;
}

class GetCollectionWithReposService {
  public async execute({ collectionId }: ServiceRequest): Promise<Collection> {
    const collectionsRepository = getRepository(Collection);

    const collection = await collectionsRepository.findOne({
      where: { id: collectionId },
      relations: ['repositories'],
    });

    if (!collection) {
      throw new ErrorResponse('No collection found with this ID.', 404);
    }

    return collection;
  }
}

export default GetCollectionWithReposService;
