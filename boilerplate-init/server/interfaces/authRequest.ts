import {Request} from 'express';
import IUser from './user';
export interface IAuthRequest extends Request {
  token?: string;
  user?: IUser; // or any other type
}
