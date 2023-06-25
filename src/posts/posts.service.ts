import { Injectable } from "@nestjs/common";

import { PostsMapper } from "./posts.mapper";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { PostsRepository } from "./posts.repository";

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private postsMapper: PostsMapper,
  ) {}

  findAll(draft = false) {
    return this.postsRepository.findAll(draft);
  }

  findById(postId: number) {
    return this.postsRepository.findById(postId);
  }

  findAllByTitle(postTitle: string) {
    return this.postsRepository.findAllByTitle(postTitle);
  }

  create(createPostInput: CreatePostInput) {
    return this.postsRepository.create(
      this.postsMapper.dtoToEntity(createPostInput),
    );
  }

  update(updatePostInput: UpdatePostInput) {
    return this.postsRepository.update(
      this.postsMapper.dtoToEntity(updatePostInput),
    );
  }

  remove(postId: number) {
    return this.postsRepository.remove(postId);
  }
}
