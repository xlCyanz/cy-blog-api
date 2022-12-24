import { Injectable } from "@nestjs/common";

import MongooseUtils from "../utils/mongoose-utils";
import { MessageCode } from "../interfaces";
import { CategoriesMapper } from "./categories.mapper";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { CategoriesRepository } from "./categories.repository";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private categoriesMapper: CategoriesMapper,
  ) {}

  private exceptionMessageInvalid = "Category id is invalid";

  findAll() {
    return this.categoriesRepository.findAll();
  }

  findById(categoryId: string) {
    return this.categoriesRepository.findById(
      MongooseUtils.stringToObjectId(
        categoryId,
        MessageCode.CATEGORY_ID_INVALID,
      ),
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
      MongooseUtils.stringToObjectId(categoryId, this.exceptionMessageInvalid),
      this.categoriesMapper.dtoToEntity(updateCategoryInput),
    );
  }

  remove(categoryId: string) {
    return this.categoriesRepository.remove(
      MongooseUtils.stringToObjectId(categoryId, this.exceptionMessageInvalid),
    );
  }
}
