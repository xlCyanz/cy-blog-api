import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { MessageCode, Response } from "@interfaces";

import User from "./entities/user.entity";
import UsersYup from "./users.yup";
import UsersService from "./users.service";
import ResponseUser from "./dto/response.user";
import CreateUserInput from "./dto/create-user.input";
import UpdateUserInput from "./dto/update-user.input";

@Resolver(() => User)
export default class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersYup: UsersYup,
  ) {}

  @Query(() => ResponseUser, { name: "user" })
  async findById(
    @Args("id", { type: () => String }) userId: string,
  ): Promise<Response<User>> {
    if (!userId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.USER_ID_REQUIRED,
      });
    }

    const userById = await this.usersService.findById(userId);

    if (!userById) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.USER_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.USER_FOUND,
      data: userById,
    };
  }

  @Query(() => ResponseUser, { name: "userByEmail" })
  async findByEmail(
    @Args("email", { type: () => String }) email: string,
  ): Promise<Response<User>> {
    if (!email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.USER_MAIL_REQUIRED,
      });
    }

    try {
      const validateEmail = this.usersYup.validationUserEmail(email);
      const userByEmail = await this.usersService.findByEmail(validateEmail);

      if (!userByEmail) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          messageCode: MessageCode.USER_NOT_FOUND,
        });
      }

      return {
        statusCode: HttpStatus.FOUND,
        messageCode: MessageCode.USER_FOUND,
        data: userByEmail,
      };
    } catch (error) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: error.errors[0],
      });
    }
  }

  @Mutation(() => ResponseUser)
  async createUser(
    @Args("input") input: CreateUserInput,
  ): Promise<Response<User>> {
    try {
      const validateUser = this.usersYup.validationUser(input);
      const userCreated = await this.usersService.create(validateUser);

      return {
        statusCode: HttpStatus.CREATED,
        messageCode: MessageCode.USER_CREATED,
        data: userCreated,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }

  @Mutation(() => ResponseUser)
  async updateUser(
    @Args("input") updateUserInput: UpdateUserInput,
  ): Promise<Response<User>> {
    if (!updateUserInput._id) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.USER_ID_REQUIRED,
      });
    }

    const userUpdated = await this.usersService.update(updateUserInput);

    return {
      statusCode: HttpStatus.OK,
      messageCode: MessageCode.USER_UPDATED,
      data: userUpdated,
    };
  }

  @Mutation(() => ResponseUser)
  async removeUser(
    @Args("id", { type: () => String }) userId: string,
  ): Promise<Response<User>> {
    if (!userId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.USER_ID_REQUIRED,
      });
    }

    const userRemoved = await this.usersService.remove(userId);

    if (!userRemoved) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: MessageCode.USER_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      messageCode: MessageCode.USER_REMOVED,
      data: userRemoved,
    };
  }
}
