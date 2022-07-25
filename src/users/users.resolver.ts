import { User } from "./entities/user.entity";
import { Response } from "../interfaces/response.interface";
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
        message: "User id is required",
      });
    }

    const userById = await this.usersService.findById(userId);

    if (!userById) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      message: "User found",
      data: userById,
    };
  }

  /**
   *
   * Method to find user by name.
   *
   * @param name - User name
   *
   * @returns {Promise<Response<User>>} User
   */
  @Query(() => ResponseUser, { name: "userByName" })
  async findByName(
    @Args("name", { type: () => String }) name: string,
  ): Promise<Response<User>> {
    if (!name) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Name is required",
      });
    }

    const userByName = await this.usersService.findByName(name);

    if (!userByName) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      message: "User found",
      data: userByName,
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
        message: "Email is required",
      });
    }

    const userByEmail = await this.usersService.findByEmail(email);

    if (!userByEmail) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      message: "User found",
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
    if (!input.name) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Name is required",
      });
    }

    if (!input.email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Email is required",
      });
    }

    if (!input.password) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Password is required",
      });
    }

    const userCreated = await this.usersService.create(input);

    return {
      statusCode: HttpStatus.CREATED,
      message: "User created",
      data: userCreated,
    };
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
        message: "User id is required",
      });
    }

    const userUpdated = await this.usersService.update(updateUserInput);

    return {
      statusCode: HttpStatus.OK,
      message: "User updated",
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
        message: "User id is required",
      });
    }

    const userRemoved = await this.usersService.remove(userId);

    if (!userRemoved) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: "User removed",
      data: userRemoved,
    };
  }
}
