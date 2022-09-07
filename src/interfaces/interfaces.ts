import { User } from "../users/entities/user.entity";

export interface Response<T> {
  statusCode: number;
  message: string;
  data?: T;
}

export type IUser = User;
