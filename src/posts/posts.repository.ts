import { Injectable } from "@nestjs/common";

import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";

@Injectable()
export class PostsRepository {
  create(createBlogInput: CreatePostInput) {
    return "This action adds a new blog";
  }

  findAll() {
    return `This action returns all blogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogInput: UpdatePostInput) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
