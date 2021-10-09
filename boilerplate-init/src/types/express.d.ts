import IUser from '../interfaces/user';

declare global {
  namespace Express {
    interface Request {
      token: string;
      user: IUser;
      cookie?: {
        x_auth: string;
      };
    }
  }
}
