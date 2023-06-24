import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";

import { PostEntity } from "./entities/post.entity";
import { PostsService } from "./posts.service";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";

@Resolver(() => PostEntity)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => PostEntity)
  createPost(@Args("createPostInput") createPostInput: CreatePostInput) {
    return this.postsService.create(createPostInput);
  }

  @Query(() => [PostEntity], { name: "posts" })
  findAll() {
    return this.postsService.findAll();
  }

  @Query(() => PostEntity, { name: "post" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => PostEntity)
  updatePost(@Args("updatePostInput") updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => PostEntity)
  removePost(@Args("id", { type: () => Int }) id: number) {
    return this.postsService.remove(id);
  }
}
