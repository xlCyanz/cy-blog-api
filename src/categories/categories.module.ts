import { Module } from "@nestjs/common";

import PrismaModule from "@prisma/prisma.module";

import { CategoriesMapper } from "./categories.mapper";
import { CategoriesService } from "./categories.service";
import { CategoriesResolver } from "./categories.resolver";
import { CategoriesRepository } from "./categories.repository";

@Module({
  imports: [PrismaModule],
  providers: [
    CategoriesResolver,
    CategoriesService,
    CategoriesRepository,
    CategoriesMapper,
  ],
})
export default class CategoriesModule {}
