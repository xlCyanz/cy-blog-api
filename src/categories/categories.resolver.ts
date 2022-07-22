import { Category } from "./entities/category.entity";
import { Response } from "../interfaces/response.interface";
import { CategoriesService } from "./categories.service";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ResponseCategories, ResponseCategory } from "./dto/response.category";
import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Method to find all categories.
   *
   * @returns {Promise<Response<Category[]>>} Categories
   */
  @Query(() => ResponseCategories, { name: "categories" })
  async findAll(): Promise<Response<Category[]>> {
    const categories = await this.categoriesService.findAll();

    if (categories.length === 0 || !categories) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Categories not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      statusCode: HttpStatus.FOUND,
      message: "Categories found",
      data: categories,
    };
  }

  /**
   * Method to find one category by id.
   *
   * @param categoryId - Category id
   *
   * @returns {Promise<Response<Category>>} Category
   */
  @Query(() => ResponseCategory, { name: "categoryById" })
  async findById(
    @Args("id", { type: () => String }) categoryId: string,
  ): Promise<Response<Category>> {
    if (!categoryId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category id is required",
      });
    }

    const category = await this.categoriesService.findById(categoryId);

    if (!category) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Category not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      statusCode: HttpStatus.FOUND,
      message: "Category found",
      data: category,
    };
  }

  /**
   * Method to find one category by name.
   *
   * @param categoryName - Category name
   *
   * @returns {Promise<Response<Category>>} Category
   */
  @Query(() => ResponseCategory, { name: "categoryByName" })
  async findByName(
    @Args("name", { type: () => String }) categoryName: string,
  ): Promise<Response<Category>> {
    if (!categoryName) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category name is required",
      });
    }

    const category = await this.categoriesService.findByName(categoryName);

    if (!category) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Category not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      statusCode: HttpStatus.FOUND,
      message: "Category found",
      data: category,
    };
  }

  /**
   * Method to create a new category.
   *
   * @param input - Category name
   *
   * @returns {Promise<Response<Category>>} Category
   */
  @Mutation(() => ResponseCategory)
  async createCategory(
    @Args("input", { type: () => CreateCategoryInput })
    input: CreateCategoryInput,
  ): Promise<Response<Category>> {
    if (!input.name)
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category name is required",
      });

    if (!input.description) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category description is required",
      });
    }

    const newCategory = await this.categoriesService.create(input);

    return {
      statusCode: HttpStatus.CREATED,
      message: "Category created",
      data: newCategory,
    };
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
    if (!input.id)
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category id is required",
      });

    const categoryUpdated = await this.categoriesService.update(
      input.id,
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
    @Args("id", { type: () => String }) categoryId: string,
  ): Promise<Response<Category>> {
    if (!categoryId)
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category id is required",
      });

    const categoryRemoved = await this.categoriesService.remove(categoryId);

    return {
      statusCode: HttpStatus.OK,
      message: "Category removed",
      data: categoryRemoved,
    };
  }
}
