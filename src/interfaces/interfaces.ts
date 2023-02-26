import User from "../users/entities/user.entity";
import Category from "../categories/entities/category.entity";
import UpdateUserInput from "../users/dto/update-user.input";
import UpdateCategoryInput from "../categories/dto/update-category.input";

import { Post } from "../posts/entities/post.entity";
import { MessageCode } from "./message-code";

export interface Response<T> {
  statusCode: number;
  messageCode?: MessageCode;
  message?: string;
  data?: T;
}

export type IUser = User;
export type IUpdateUser = UpdateUserInput;

export type ICategory = Category;
export type IUpdateCategory = UpdateCategoryInput;

export type IPost = Post;
