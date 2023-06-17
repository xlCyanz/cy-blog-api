import { Module } from "@nestjs/common";

import { PrismaModule } from "@/prisma/prisma.module";

import CategoriesYup from "./categories.yup";
import CategoriesMapper from "./categories.mapper";
import CategoriesService from "./categories.service";
import CategoriesResolver from "./categories.resolver";
import CategoriesRepository from "./categories.repository";

@Module({
  imports: [PrismaModule],
  providers: [
    CategoriesResolver,
    CategoriesService,
    CategoriesRepository,
    CategoriesMapper,
    CategoriesYup,
  ],
})
export class CategoriesModule {}
