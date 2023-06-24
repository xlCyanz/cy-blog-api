import { Injectable } from "@nestjs/common";

import { CategoryEntity } from "./entities/category.entity";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";

@Injectable()
export class CategoriesMapper {
  dtoToEntity(dto: CreateCategoryInput | UpdateCategoryInput): CategoryEntity {
    return new CategoryEntity({ ...dto });
  }

  entityToDto(category: CategoryEntity): CreateCategoryInput {
    return new CreateCategoryInput({ ...category });
  }
}
