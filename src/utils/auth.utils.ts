import { sign } from 'jsonwebtoken';

/* eslint-disable no-useless-escape */
export function checkIsValidEmail(email: string): boolean {
  const emailRegex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

  return emailRegex.test(email);
}

export function checkIsValidPassword(password: string): boolean {
  if (password.length < 6) return false;

  return true;
}

export function createToken(userId: string): string {
  const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

  const token = sign({}, `${JWT_SECRET}`, {
    subject: userId,
    expiresIn: JWT_EXPIRES_IN,
  });

  return token;
}
