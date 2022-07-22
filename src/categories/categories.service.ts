import { Types } from "mongoose";
import { Injectable } from "@nestjs/common";
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

  findAll() {
    return this.categoriesRepository.findAll();
  }

  findById(categoryId: string) {
    return this.categoriesRepository.findById(new Types.ObjectId(categoryId));
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
      new Types.ObjectId(categoryId),
      this.categoriesMapper.dtoToEntity(updateCategoryInput),
    );
  }

  remove(categoryId: string) {
    return this.categoriesRepository.remove(new Types.ObjectId(categoryId));
  }
}