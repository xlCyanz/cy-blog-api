import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { Response } from "@/interfaces";
import { MessageCode } from "@/constants";

import { PostEntity } from "./entities/post.entity";
import { PostsService } from "./posts.service";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { ResponsePost, ResponsePosts } from "./dto/response.post";

@Resolver(() => PostEntity)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => ResponsePosts, { name: "posts" })
  async findAll(): Promise<Response<PostEntity[]>> {
    const posts = await this.postsService.findAll(true);

    if (!posts.length) {
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

  @Query(() => ResponsePosts, { name: "postsByCategory" })
  async findAllByCategory(
    @Args("categoryId", { type: () => Number }) categoryId: number,
  ): Promise<Response<PostEntity[]>> {
    if (!categoryId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.CATEGORY_ID_REQUIRED,
      });
    }

    const posts = await this.postsService.findAllByCategory(categoryId);

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

    const post = await this.postsService.findBySlug(postSlug);

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

  @Mutation(() => ResponsePost)
  async createPost(
    @Args("input") input: CreatePostInput,
  ): Promise<Response<PostEntity>> {
    const newPost = await this.postsService.create(input);

    return {
      statusCode: HttpStatus.CREATED,
      messageCode: MessageCode.POST_CREATED,
      data: newPost,
    };
  }

  @Mutation(() => ResponsePost)
  async publishPost(
    @Args("id") postId: number,
  ): Promise<Response<Partial<PostEntity>>> {
    if (!postId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.POST_ID_REQUIRED,
      });
    }

    const publishedPost = await this.postsService.update({
      id: postId,
      published: true,
    });

    return {
      statusCode: HttpStatus.OK,
      messageCode: MessageCode.POST_PUBLISHED,
      data: publishedPost,
    };
  }

  @Mutation(() => ResponsePost)
  async updatePost(
    @Args("input") input: UpdatePostInput,
  ): Promise<Response<PostEntity>> {
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
