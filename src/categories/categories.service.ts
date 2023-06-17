import { Injectable } from "@nestjs/common";

import CategoriesMapper from "./categories.mapper";
import CreateCategoryInput from "./dto/create-category.input";
import UpdateCategoryInput from "./dto/update-category.input";
import CategoriesRepository from "./categories.repository";

@Injectable()
export default class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private categoriesMapper: CategoriesMapper,
  ) {}

  findAll() {
    return this.categoriesRepository.findAll();
  }

  findById(categoryId: number) {
    return this.categoriesRepository.findById(categoryId);
  }

  findByName(name: string) {
    return this.categoriesRepository.findByName(name);
  }

  create(createCategoryInput: CreateCategoryInput) {
    return this.categoriesRepository.create(
      this.categoriesMapper.dtoToEntity(createCategoryInput),
    );
  }

  update(updateCategoryInput: UpdateCategoryInput) {
    return this.categoriesRepository.update(
      this.categoriesMapper.dtoToEntity(updateCategoryInput),
    );
  }

  remove(categoryId: number) {
    return this.categoriesRepository.remove(categoryId);
  }
}
