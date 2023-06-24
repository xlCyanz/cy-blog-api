import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { MessageCode, Response } from "@interfaces";

import User from "./entities/user.entity";
import UsersService from "./users.service";
import ResponseUser from "./dto/response.user";
import CreateUserInput from "./dto/create-user.input";
import UpdateUserInput from "./dto/update-user.input";

@Resolver(() => User)
export default class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => ResponseUser, { name: "me" })
  async me() {
    return {
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      messageCode: MessageCode.USER_NOT_IMPLEMENTED,
    };
  }

  @Mutation(() => ResponseUser)
  async createUser(
    @Args("input") input: CreateUserInput,
  ): Promise<Response<User>> {
    try {
      const userCreated = await this.usersService.create(input);

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
    if (!updateUserInput.id) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.USER_ID_REQUIRED,
      });
    }

    try {
      const userUpdated = await this.usersService.update(updateUserInput);

      return {
        statusCode: HttpStatus.OK,
        messageCode: MessageCode.USER_UPDATED,
        data: userUpdated,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }

  @Mutation(() => ResponseUser)
  async removeUser(
    @Args("id", { type: () => Number }) userId: number,
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
