import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesMapper } from "./categories.mapper";
import { CategoriesService } from "./categories.service";
import { CategoriesResolver } from "./categories.resolver";
import { CategoriesRepository } from "./categories.repository";
import { Category, CategorySchema } from "./entities/category.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [
    CategoriesResolver,
    CategoriesService,
    CategoriesRepository,
    CategoriesMapper,
  ],
})
export class CategoriesModule {}
