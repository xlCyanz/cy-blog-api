import { UserEntity } from "@users/entities/user.entity";
import { MessageCode } from "@constants";
import { CategoryEntity } from "@categories/entities/category.entity";
import { UpdateUserInput } from "@users/dto/update-user.input";
import { UpdateCategoryInput } from "@categories/dto/update-category.input";

export interface Response<T> {
  statusCode: number;
  messageCode?: IMessageCode | string;
  message?: string;
  data?: T;
}

export type IUser = UserEntity;
export type IUpdateUser = UpdateUserInput;

export type ICategory = CategoryEntity;
export type IUpdateCategory = UpdateCategoryInput;

export type IMessageCode = keyof typeof MessageCode;
