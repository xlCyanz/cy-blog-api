import { Injectable } from "@nestjs/common";

import { Post } from "./entities/post.entity";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";

@Injectable()
export class PostsMapper {
  dtoToEntity(dto: CreatePostInput | UpdatePostInput): Post {
    return new Post({ ...dto });
  }

  entityToDto(post: Post): CreatePostInput {
    return new CreatePostInput({ ...post });
  }
}
