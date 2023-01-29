import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";

import { Post } from "./entities/post.entity";
import { PostsService } from "./posts.service";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  createPost(@Args("createPostInput") createPostInput: CreatePostInput) {
    return this.postsService.create(createPostInput);
  }

  @Query(() => [Post], { name: "posts" })
  findAll() {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: "post" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args("updatePostInput") updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput._id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args("id", { type: () => Int }) id: number) {
    return this.postsService.remove(id);
  }
}
