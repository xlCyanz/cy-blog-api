import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { Response } from "@interfaces";
import { MessageCode } from "@constants";

import { CategoryEntity } from "./entities/category.entity";
import { CategoriesService } from "./categories.service";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { ResponseCategories, ResponseCategory } from "./dto/response.category";

@Resolver(() => CategoryEntity)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => ResponseCategories, { name: "categories" })
  async findAll(): Promise<Response<CategoryEntity[]>> {
    const categories = await this.categoriesService.findAll();

    if (!categories.length) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.CATEGORIES_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.CATEGORIES_FOUND,
      data: categories,
    };
  }

  @Query(() => ResponseCategory, { name: "categoryById" })
  async findById(
    @Args("id", { type: () => Number }) categoryId: number,
  ): Promise<Response<CategoryEntity>> {
    if (!categoryId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.CATEGORY_ID_REQUIRED,
      });
    }

    const category = await this.categoriesService.findById(categoryId);

    if (!category) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.CATEGORY_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.CATEGORY_FOUND,
      data: category,
    };
  }

  @Query(() => ResponseCategory, { name: "categoryByName" })
  async findByName(
    @Args("name", { type: () => String }) categoryName: string,
  ): Promise<Response<CategoryEntity>> {
    if (!categoryName) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.CATEGORY_NAME_REQUIRED,
      });
    }

    const category = await this.categoriesService.findByName(categoryName);

    if (!category) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.CATEGORY_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.CATEGORY_FOUND,
      data: category,
    };
  }

  @Mutation(() => ResponseCategory)
  async createCategory(
    @Args("input", { type: () => CreateCategoryInput })
    input: CreateCategoryInput,
  ): Promise<Response<CategoryEntity>> {
    const newCategory = await this.categoriesService.create(input);

    return {
      statusCode: HttpStatus.CREATED,
      messageCode: MessageCode.CATEGORY_CREATED,
      data: newCategory,
    };
  }

  @Mutation(() => ResponseCategory)
  async updateCategory(
    @Args("input") input: UpdateCategoryInput,
  ): Promise<Response<CategoryEntity>> {
    if (!input.id) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.CATEGORY_ID_REQUIRED,
      });
    }

    try {
      const categoryUpdated = await this.categoriesService.update(input);

      return {
        statusCode: HttpStatus.OK,
        messageCode: MessageCode.CATEGORY_UPDATED,
        data: categoryUpdated,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }

  @Mutation(() => ResponseCategory)
  async removeCategory(
    @Args("id", { type: () => Number }) categoryId: number,
  ): Promise<Response<CategoryEntity>> {
    if (!categoryId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.CATEGORY_ID_REQUIRED,
      });
    }

    try {
      const categoryRemoved = await this.categoriesService.remove(categoryId);

      if (!categoryRemoved) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          messageCode: MessageCode.CATEGORY_NOT_FOUND,
        });
      }

      return {
        statusCode: HttpStatus.OK,
        messageCode: MessageCode.CATEGORY_REMOVED,
        data: categoryRemoved,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }
}
