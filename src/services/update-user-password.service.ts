import { compare, hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import ErrorResponse from '../errors/ErrorResponse';
import { checkIsValidPassword } from '../utils/auth.utils';
import User from '../models/user.model';

interface ServiceRequest {
  user: User;
  currentPassword: string;
  newPassword: string;
}

class UpdateUserPasswordService {
  public async execute({
    user,
    currentPassword,
    newPassword,
  }: ServiceRequest): Promise<void> {
    const usersRepository = getRepository(User);

    const isMatch = await compare(currentPassword, user.password);

    if (!isMatch) {
      throw new ErrorResponse('Incorrect password.', 401);
    }

    if (!checkIsValidPassword(newPassword)) {
      throw new ErrorResponse(
        'Password invalid. Please add a new password with at least 6 characters.',
        400,
      );
    }

    const hashedNewPassword = await hash(newPassword, 8);
    const userWithNewPass = {
      ...user,
      password: hashedNewPassword,
    };

    await usersRepository.save(userWithNewPass);
  }
}

export default UpdateUserPasswordService;
