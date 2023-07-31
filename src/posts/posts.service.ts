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
    return this.postsRepository.findAll({ where: { published: draft } });
  }

  findById(postId: number) {
    return this.postsRepository.findUnique({
      where: { id: postId },
      include: { author: true, category: true },
    });
  }

  findAllByTitle(postTitle: string) {
    return this.postsRepository.findMany({
      where: { title: { contains: postTitle }, published: true },
    });
  }

  findAllByCategory(categoryId: number) {
    return this.postsRepository.findMany({
      where: { categoryId, published: true },
    });
  }

  findAllByAuthor(authorId: number) {
    return this.postsRepository.findMany({
      where: { authorId, published: true },
    });
  }

  findBySlug(slug: string) {
    return this.postsRepository.findFirst({ where: { slug, published: true } });
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
