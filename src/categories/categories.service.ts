import { Types } from "mongoose";
import { CategoriesMapper } from "./categories.mapper";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { CategoriesRepository } from "./categories.repository";
import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private categoriesMapper: CategoriesMapper,
  ) {}

  /**
   * Method to convert a string to ObjectId bson.
   *
   * Generate a BadRequestException if string is not a valid ObjectId.
   *
   * @param categoryId - The categoryId to check.
   */
  private stringToObjectId(categoryId: string) {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category id is invalid",
      });
    }

    return new Types.ObjectId(categoryId);
  }

  findAll() {
    return this.categoriesRepository.findAll();
  }

  findById(categoryId: string) {
    return this.categoriesRepository.findById(
      this.stringToObjectId(categoryId),
    );
  }

  findByName(name: string) {
    return this.categoriesRepository.findByName(name);
  }

  create(createCategoryInput: CreateCategoryInput) {
    return this.categoriesRepository.create(
      this.categoriesMapper.dtoToEntity(createCategoryInput),
    );
  }

  update(categoryId: string, updateCategoryInput: UpdateCategoryInput) {
    return this.categoriesRepository.update(
      this.stringToObjectId(categoryId),
      this.categoriesMapper.dtoToEntity(updateCategoryInput),
    );
  }

  remove(categoryId: string) {
    return this.categoriesRepository.remove(this.stringToObjectId(categoryId));
  }
}
