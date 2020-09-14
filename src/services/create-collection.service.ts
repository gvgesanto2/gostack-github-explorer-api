import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import User from '../models/user.model';

class CreateCollectionService {
  public async execute({
    owner_id,
    is_public,
    public_title,
    title,
    description,
    image_url,
  }: Omit<Collection, 'id' | 'owner' | 'created_at' | 'updated_at'>): Promise<
    Collection
  > {
    const collectionsRepository = getRepository(Collection);
    const usersRepository = getRepository(User);

    const publicTitleGenerated =
      public_title && is_public ? public_title : `${title}#${owner_id}`;

    const [existingUser, existingCollection] = await Promise.all([
      usersRepository.findOne(owner_id),
      collectionsRepository.findOne({
        where: { public_title: publicTitleGenerated },
      }),
    ]);

    if (!existingUser) {
      throw new ErrorResponse('No user found with this ID.', 404);
    }

    if (existingCollection) {
      throw new ErrorResponse(
        'This collection title is already been used.',
        400,
      );
    }

    const newCollection = collectionsRepository.create({
      owner_id,
      is_public,
      public_title: publicTitleGenerated,
      title,
      description,
      image_url,
    });

    await collectionsRepository.save(newCollection);

    return newCollection;
  }
}

export default CreateCollectionService;
