import * as R from "radash";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import {
  HttpStatus,
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

import { MessageCode } from "@constants";
import { PrismaService } from "@/prisma/prisma.service";

import { PostEntity } from "./entities/post.entity";

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    args: Prisma.PostFindManyArgs<DefaultArgs>,
  ): Promise<PostEntity[]> {
    return await this.prisma.post.findMany(args);
  }

  async findUnique(
    args: Prisma.PostFindUniqueArgs<DefaultArgs>,
  ): Promise<PostEntity> {
    return await this.prisma.post.findUnique(args);
  }

  async findMany(
    args: Prisma.PostFindManyArgs<DefaultArgs>,
  ): Promise<PostEntity[]> {
    return await this.prisma.post.findMany(args);
  }

  async findFirst(
    args: Prisma.PostFindFirstArgs<DefaultArgs>,
  ): Promise<PostEntity> {
    return await this.prisma.post.findFirst(args);
  }

  async create(newPost: PostEntity): Promise<PostEntity> {
    try {
      return await this.prisma.post.create({
        data: {
          title: newPost.title,
          content: newPost.content,
          image: newPost.image,
          author: { connect: { id: newPost.authorId } },
          category: { connect: { id: newPost.categoryId } },
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          messageCode: MessageCode.POST_ALREADY_EXISTS,
        });
      }

      if (error.code === "P2025") {
        if (!newPost.authorId) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            messageCode: MessageCode.USER_ID_REQUIRED,
          });
        }
        if (!newPost.categoryId) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            messageCode: MessageCode.CATEGORY_ID_REQUIRED,
          });
        }
      }

      throw new BadRequestException(error);
    }
  }

  async update(updatePost: PostEntity): Promise<PostEntity> {
    try {
      return await this.prisma.post.update({
        data: R.omit(updatePost, [
          "id",
          "author",
          "category",
          "authorId",
          "categoryId",
        ]),
        where: { id: updatePost.id },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number): Promise<PostEntity> {
    return await this.prisma.post.delete({ where: { id } });
  }
}
