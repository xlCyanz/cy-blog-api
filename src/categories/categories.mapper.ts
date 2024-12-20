import { Injectable } from "@nestjs/common";

import Category from "./entities/category.entity";
import CreateCategoryInput from "./dto/create-category.input";
import UpdateCategoryInput from "./dto/update-category.input";

@Injectable()
export default class CategoriesMapper {
  dtoToEntity(dto: CreateCategoryInput | UpdateCategoryInput): Category {
    return new Category({ ...dto });
  }

  entityToDto(category: Category): CreateCategoryInput {
    return new CreateCategoryInput({ ...category });
  }
}
