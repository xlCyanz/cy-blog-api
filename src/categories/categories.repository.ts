import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Injectable, BadRequestException, HttpStatus } from "@nestjs/common";

import { MessageCode } from "../interfaces";
import { Category, CategoryDocument } from "./entities/category.entity";

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find();
  }

  async findById(categoryId: Types.ObjectId): Promise<Category> {
    return await this.categoryModel.findById(categoryId);
  }

  async findByName(categoryName: string): Promise<Category> {
    return await this.categoryModel.findOne({ name: categoryName });
  }

  async create(newCategory: Category): Promise<Category> {
    try {
      return await this.categoryModel.create(newCategory);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          messageCode: MessageCode.CATEGORY_ALREADY_EXISTS,
        });
      } else throw new BadRequestException(error);
    }
  }

  async update(
    categoryId: Types.ObjectId,
    updateCategory: Category,
  ): Promise<Category> {
    try {
      return await this.categoryModel.findByIdAndUpdate(
        categoryId,
        updateCategory,
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(categoryId: Types.ObjectId) {
    return await this.categoryModel.findByIdAndDelete(categoryId);
  }
}
