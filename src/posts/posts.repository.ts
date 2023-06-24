import * as R from "radash";
import {
  HttpStatus,
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

import { MessageCode } from "@/interfaces";
import { PrismaService } from "@/prisma/prisma.service";

import { PostEntity } from "./entities/post.entity";

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(draft = false): Promise<PostEntity[]> {
    return await this.prisma.post.findMany({ where: { published: !draft } });
  }

  async findById(postId: number): Promise<PostEntity> {
    return await this.prisma.post.findUnique({ where: { id: postId } });
  }

  async findAllByName(postName: string): Promise<PostEntity[]> {
    return await this.prisma.post.findMany({
      where: {
        title: { contains: postName },
      },
    });
  }

  async create(newPost: PostEntity): Promise<PostEntity> {
    try {
      return await this.prisma.post.create({ data: newPost });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          messageCode: MessageCode.POST_ALREADY_EXISTS,
        });
      }
      throw new BadRequestException(error);
    }
  }

  async update(updatePost: PostEntity): Promise<PostEntity> {
    try {
      return await this.prisma.post.update({
        data: R.omit(updatePost, ["id"]),
        where: { id: updatePost.id },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(postId: number): Promise<PostEntity> {
    return await this.prisma.post.delete({ where: { id: postId } });
  }
}
