import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import Collection from '../models/collection.model';
import User from '../models/user.model';
import {
  checkIsValidEmail,
  checkIsValidPassword,
  createToken,
} from '../utils/auth.utils';

interface ServiceResponse {
  user: User;
  token: string;
}

const userRoles = ['user'];

class RegisterUserService {
  public async execute({
    name,
    avatar,
    role,
    email,
    password,
  }: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceResponse> {
    const usersRepository = getRepository(User);
    const collectionsRepository = getRepository(Collection);

    const userRole = userRoles.includes(role) ? role : 'user';

    if (!checkIsValidEmail(email)) {
      throw new ErrorResponse('Email invalid. Please add a valid email.', 400);
    }

    if (!checkIsValidPassword(password)) {
      throw new ErrorResponse(
        'Password invalid. Please add a password with at least 6 characters.',
        400,
      );
    }

    const existingUser = await usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ErrorResponse('This email address is already been used.', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      avatar,
      role: userRole,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    const collectionAllReposTitle = process.env.ALL_REPOS_COLLECTION_NAME;
    const collectionAllRepos = collectionsRepository.create({
      title: collectionAllReposTitle,
      description: 'All my repositories [special collection]',
      owner_id: user.id,
      public_title: `${collectionAllReposTitle}#${user.id}`,
      is_public: false,
      image_url: '',
    });

    const collectionFavoritesTitle = process.env.FAVORITES_COLLECTION_NAME;
    const collectionFavorites = collectionsRepository.create({
      title: collectionFavoritesTitle,
      description: 'My favorites repositories [special collection]',
      owner_id: user.id,
      public_title: `${collectionFavoritesTitle}#${user.id}`,
      is_public: false,
      image_url: '',
    });

    await Promise.all([
      await collectionsRepository.save(collectionAllRepos),
      await collectionsRepository.save(collectionFavorites),
    ]);

    const token = createToken(user.id);

    return {
      user,
      token,
    };
  }
}

export default RegisterUserService;
