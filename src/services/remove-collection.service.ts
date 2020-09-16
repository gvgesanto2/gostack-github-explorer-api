import { getRepository } from 'typeorm';

import { specialCollectionsTitles } from '../config/collection.config';
import { roles } from '../config/roles';
import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import User from '../models/user.model';

interface ServiceRequest {
  user: User;
  collectionId: string;
}

class RemoveCollectionService {
  public async execute({
    user: { id, role },
    collectionId,
  }: ServiceRequest): Promise<void> {
    const collectionsRepository = getRepository(Collection);

    const collectionToRemove = await collectionsRepository.findOne(
      collectionId,
    );

    if (!collectionToRemove) {
      throw new ErrorResponse('No collection found with this ID', 404);
    } else if (collectionToRemove.owner_id !== id && role !== roles.ADMIN) {
      throw new ErrorResponse(
        'You are not authorized to complete this action.',
        403,
      );
    }

    if (specialCollectionsTitles.includes(collectionToRemove.title)) {
      throw new ErrorResponse('Special collections can not be deleted.', 403);
    }

    await collectionsRepository.remove(collectionToRemove);
  }
}

export default RemoveCollectionService;
