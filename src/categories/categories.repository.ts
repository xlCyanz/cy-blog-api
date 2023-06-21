import * as R from "radash";
import {
  Injectable,
  HttpStatus,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

import { MessageCode } from "@/interfaces";
import { PrismaService } from "@/prisma/prisma.service";

import Category from "./entities/category.entity";

@Injectable()
export default class CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }

  async findById(categoryId: number): Promise<Category> {
    return await this.prisma.category.findUnique({ where: { id: categoryId } });
  }

  async findByName(categoryName: string): Promise<Category> {
    return await this.prisma.category.findUnique({
      where: { name: categoryName },
    });
  }

  async create(newCategory: Category): Promise<Category> {
    try {
      return await this.prisma.category.create({ data: newCategory });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          messageCode: MessageCode.CATEGORY_ALREADY_EXISTS,
        });
      }
      throw new BadRequestException(error);
    }
  }

  async update(updateCategory: Category): Promise<Category> {
    try {
      return await this.prisma.category.update({
        data: R.omit(updateCategory, ["id", "createdAt", "updatedAt"]),
        where: { id: updateCategory.id },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(categoryId: number) {
    return await this.prisma.category.delete({ where: { id: categoryId } });
  }
}
