import { User } from "../users/entities/user.entity";
import { Post } from "../posts/entities/post.entity";
import { Category } from "../categories/entities/category.entity";
import { MessageCode } from "./message-code";

export interface Response<T> {
  statusCode: number;
  messageCode?: MessageCode;
  message?: string;
  data?: T;
}

export type IUser = User;

export type ICategory = Category;

export type IPost = Post;
