import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Category, CategoryDocument } from "./entities/category.entity";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find();
  }

  async findById(categoryId: Types.ObjectId): Promise<Category> {
    try {
      return await this.categoryModel.findById(categoryId);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findByName(categoryName: string): Promise<Category> {
    try {
      return await this.categoryModel.findOne({ name: categoryName });
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async create(newCategory: Category): Promise<Category> {
    try {
      return await this.categoryModel.create(newCategory);
    } catch (error) {
      throw new BadRequestException(error);
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
    try {
      return await this.categoryModel.findByIdAndDelete(categoryId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
