export const ADMIN = 'admin';
export const USER = 'user';

export const ROLES = [USER, ADMIN];
export const USER_ROLES = [USER];

export const roles = {
  USER,
  ADMIN,
};

export const userRoles = {
  USER,
};

export type Roles = 'user' | 'admin';
export type UserRoles = Omit<Roles, 'admin'>;
