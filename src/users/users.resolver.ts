import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";

import { Response } from "@interfaces";
import { MessageCode } from "@constants";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

import { GetUser } from "./users.decorator";
import { UsersService } from "./users.service";
import { ResponseUser } from "./dto/response.user";
import { UserEntity } from "./entities/user.entity";
import CreateUserInput from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => ResponseUser, { name: "me" })
  @UseGuards(JwtAuthGuard)
  async me(@GetUser() user: UserEntity) {
    if (!user.id) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.USER_ID_REQUIRED,
      });
    }

    const userById = await this.usersService.findById(user.id);
    console.log(userById);

    if (!userById) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: MessageCode.USER_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      messageCode: MessageCode.USER_FOUND,
      data: userById,
    };
  }

  @Mutation(() => ResponseUser)
  async createUser(
    @Args("input") input: CreateUserInput,
  ): Promise<Response<UserEntity>> {
    const userCreated = await this.usersService.create(input);

    return {
      statusCode: HttpStatus.CREATED,
      messageCode: MessageCode.USER_CREATED,
      data: userCreated,
    };
  }

  @Mutation(() => ResponseUser)
  async updateUser(
    @Args("input") updateUserInput: UpdateUserInput,
  ): Promise<Response<UserEntity>> {
    if (!updateUserInput.id) {
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
    @Args("id", { type: () => Number }) userId: number,
  ): Promise<Response<UserEntity>> {
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
