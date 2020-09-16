import User from '../models/user.model';

type UserType = User;

declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}

// declare namespace Express {
//   export interface Request {
//     user: {
//       id: string;
//       role?: string;
//       e?: Test;
//     };
//   }
// }
