import { User } from "../users/entities/user.entity";
import { MessageCode } from "./message-code";

export interface Response<T> {
  statusCode: number;
  messageCode?: MessageCode;
  message?: string;
  data?: T;
}

export type IUser = User;
