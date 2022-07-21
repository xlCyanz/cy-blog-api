import { Category } from "./entities/category.entity";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoriesMapper {
  dtoToEntity(dto: CreateCategoryInput | UpdateCategoryInput): Category {
    return new Category(dto.name, dto.description);
  }

  entityToDto(category: Category): CreateCategoryInput {
    return new CreateCategoryInput(category.name, category.description);
  }
}
