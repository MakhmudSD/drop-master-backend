import { User } from '../schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}
