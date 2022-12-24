import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  BadRequestException,
  HttpException,
  NotFoundException,
  HttpStatus,
} from "@nestjs/common";

import { Category } from "./entities/category.entity";
import { CategoriesService } from "./categories.service";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { MessageCode, Response } from "../interfaces";
import { ResponseCategories, ResponseCategory } from "./dto/response.category";
import { validationCategory } from "./categories.yup";

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => ResponseCategories, { name: "categories" })
  async findAll(): Promise<Response<Category[]>> {
    const categories = await this.categoriesService.findAll();

    if (categories.length === 0 || !categories) {
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
    @Args("_id", { type: () => String }) categoryId: string,
  ): Promise<Response<Category>> {
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
  ): Promise<Response<Category>> {
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
  ): Promise<Response<Category>> {
    try {
      const validateCategory = validationCategory(input);
      const newCategory = await this.categoriesService.create(validateCategory);

      return {
        statusCode: HttpStatus.CREATED,
        messageCode: MessageCode.CATEGORY_CREATED,
        data: newCategory,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }

  /**
   * Method to update a category.
   * @param input
   * @returns {Promise<Response<Category>>} Category
   */
  @Mutation(() => ResponseCategory)
  async updateCategory(
    @Args("input") input: UpdateCategoryInput,
  ): Promise<Response<Category>> {
    if (!input._id)
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category id is required",
      });

    const categoryUpdated = await this.categoriesService.update(
      input._id,
      input,
    );

    return {
      statusCode: HttpStatus.OK,
      message: "Category updated",
      data: categoryUpdated,
    };
  }

  /**
   * Method to remove a category.
   *
   * @param categoryId - Category id
   *
   * @returns {Promise<Response<Category>>} Category
   */
  @Mutation(() => ResponseCategory)
  async removeCategory(
    @Args("_id", { type: () => String }) categoryId: string,
  ): Promise<Response<Category>> {
    if (!categoryId)
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category id is required",
      });

    const categoryRemoved = await this.categoriesService.remove(categoryId);

    if (!categoryRemoved) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Category not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Category removed",
      data: categoryRemoved,
    };
  }
}
