import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import ErrorResponse from '../errors/ErrorResponse';
import User from '../models/user.model';
import { createToken } from '../utils/auth.utils';

interface ServiceRequest {
  email: string;
  password: string;
}

interface ServiceResponse {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({
    email,
    password,
  }: ServiceRequest): Promise<ServiceResponse> {
    const usersRepository = getRepository(User);

    const existingUser = await usersRepository.findOne({
      where: { email },
    });

    if (!existingUser) {
      throw new ErrorResponse('Incorrect email/password combination.', 401);
    }

    const isMatch = await compare(password, existingUser.password);

    if (!isMatch) {
      throw new ErrorResponse('Incorrect email/password combination.', 401);
    }

    const token = createToken(existingUser.id);

    return {
      user: existingUser,
      token,
    };
  }
}

export default AuthenticateUserService;
