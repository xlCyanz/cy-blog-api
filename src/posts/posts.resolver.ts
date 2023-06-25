import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
  NotImplementedException,
} from "@nestjs/common";

import { Response } from "@/interfaces";
import { MessageCode } from "@/constants";

import { PostEntity } from "./entities/post.entity";
import { PostsService } from "./posts.service";
import { ResponsePost, ResponsePosts } from "./dto/response.post";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";

@Resolver(() => PostEntity)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => ResponsePosts, { name: "posts" })
  async findAll(): Promise<Response<PostEntity[]>> {
    const posts = await this.postsService.findAll();

    if (!posts.length || !posts) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.POSTS_NOT_FOUND,
        data: [],
      };
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.POSTS_FOUND,
      data: posts,
    };
  }

  @Query(() => ResponsePosts, { name: "postsByTitle" })
  async findAllByTitle(
    @Args("title", { type: () => String }) postTitle: string,
  ): Promise<Response<PostEntity[]>> {
    if (!postTitle) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.POST_TITLE_REQUIRED,
      });
    }

    const posts = await this.postsService.findAllByTitle(postTitle);

    if (!posts.length) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.POSTS_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.POSTS_FOUND,
      data: posts,
    };
  }

  @Query(() => ResponsePost, { name: "post" })
  async findOneById(
    @Args("id", { type: () => Int }) postId: number,
  ): Promise<Response<PostEntity>> {
    if (!postId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.POST_ID_REQUIRED,
      });
    }

    const post = await this.postsService.findById(postId);

    if (!post) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.POST_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.POST_FOUND,
      data: post,
    };
  }

  @Query(() => ResponsePost, { name: "postBySlug" })
  async findOneBySlug(
    @Args("slug", { type: () => String }) postSlug: string,
  ): Promise<Response<PostEntity>> {
    if (!postSlug) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.POST_SLUG_REQUIRED,
      });
    }

    throw new NotImplementedException({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      messageCode: MessageCode.POST_SLUG_REQUIRED,
    });

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.POST_FOUND,
      data: null,
    };
  }

  @Mutation(() => ResponsePost)
  async createPost(
    @Args("input") input: CreatePostInput,
  ): Promise<Response<PostEntity>> {
    const newCategory = await this.postsService.create(input);

    return {
      statusCode: HttpStatus.CREATED,
      messageCode: MessageCode.POST_CREATED,
      data: newCategory,
    };
  }

  @Mutation(() => ResponsePost)
  async updatePost(
    @Args("input") input: UpdatePostInput,
  ): Promise<Response<PostEntity>> {
    if (!input.id) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.POST_ID_REQUIRED,
      });
    }

    try {
      const postUpdated = await this.postsService.update(input);

      return {
        statusCode: HttpStatus.OK,
        messageCode: MessageCode.POST_UPDATED,
        data: postUpdated,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }

  @Mutation(() => ResponsePost)
  async removePost(
    @Args("id", { type: () => Int }) postId: number,
  ): Promise<Response<PostEntity>> {
    if (!postId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.POST_ID_REQUIRED,
      });
    }

    try {
      const postRemoved = await this.postsService.remove(postId);

      if (!postRemoved) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          messageCode: MessageCode.POST_NOT_FOUND,
        });
      }

      return {
        statusCode: HttpStatus.OK,
        messageCode: MessageCode.POST_REMOVED,
        data: postRemoved,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }
}
