import { getRepository } from 'typeorm';
import { roles } from '../config/roles';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import User from '../models/user.model';

interface ServiceRequest {
  user?: User;
  collectionId: string;
}

class GetCollectionWithReposService {
  public async execute({
    user,
    collectionId,
  }: ServiceRequest): Promise<Collection> {
    const collectionsRepository = getRepository(Collection);

    const collection = await collectionsRepository.findOne({
      where: { id: collectionId },
      relations: ['repositories'],
    });

    if (!collection) {
      throw new ErrorResponse('No collection found with this ID.', 404);
    }

    if (!user) {
      if (!collection.is_public) {
        throw new ErrorResponse(
          'You are not authorized to complete this action.',
          401,
        );
      }
    } else {
      const { id, role } = user;

      if (
        collection.owner_id !== id &&
        !collection.is_public &&
        role !== roles.ADMIN
      ) {
        throw new ErrorResponse(
          'You are not authorized to complete this action.',
          403,
        );
      }
    }

    return collection;
  }
}

export default GetCollectionWithReposService;
