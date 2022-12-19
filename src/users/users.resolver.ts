import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { ResponseUser } from "./dto/response.user";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { MessageCode, Response } from "../interfaces";
import validationUser from "./entities/create-user.yup";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   *
   * Method to find user by id.
   *
   * @param userId - User id
   *
   * @returns {Promise<Response<User>>} User
   */
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

  /**
   *
   * Method to find user by email.
   *
   * @param email - User email
   *
   * @returns {Promise<Response<User>>} User
   */
  @Query(() => ResponseUser, { name: "userByEmail" })
  async findByEmail(
    @Args("email", { type: () => String }) email: string,
  ): Promise<Response<User>> {
    if (!email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: MessageCode.USER_MAIL_REQUIRED,
      });
    }

    const userByEmail = await this.usersService.findByEmail(email);

    if (!userByEmail) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: MessageCode.USER_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.USER_FOUND,
      data: userByEmail,
    };
  }

  /**
   *
   * Method to create a new user.
   *
   * @param input - User data
   *
   * @returns {Promise<Response<User>>} User
   */
  @Mutation(() => ResponseUser)
  async createUser(
    @Args("input") input: CreateUserInput,
  ): Promise<Response<User>> {
    try {
      const validateUser = validationUser(input);
      const userCreated = await this.usersService.create(validateUser);

      return {
        statusCode: HttpStatus.CREATED,
        messageCode: MessageCode.USER_FOUND,
        data: userCreated,
      };
    } catch (error) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: error.errors[0],
      });
    }
  }

  /**
   *
   * Method to update a user.
   *
   * @param updateUserInput - User data
   *
   * @returns {Promise<Response<User>>} User
   */
  @Mutation(() => ResponseUser)
  async updateUser(
    @Args("input") updateUserInput: UpdateUserInput,
  ): Promise<Response<User>> {
    if (!updateUserInput.id) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: MessageCode.USER_ID_REQUIRED,
      });
    }

    const userUpdated = await this.usersService.update(updateUserInput);

    return {
      statusCode: HttpStatus.OK,
      messageCode: MessageCode.USER_UPDATED,
      data: userUpdated,
    };
  }

  /**
   *
   * Method to remove a user
   *
   * @param userId - User id
   *
   * @returns {Promise<Response<User>>} User
   */
  @Mutation(() => ResponseUser)
  async removeUser(
    @Args("id", { type: () => String }) userId: string,
  ): Promise<Response<User>> {
    if (!userId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: MessageCode.USER_ID_REQUIRED,
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
