import { Injectable } from "@nestjs/common";

import { PostEntity } from "./entities/post.entity";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";

@Injectable()
export class PostsMapper {
  dtoToEntity(dto: CreatePostInput | UpdatePostInput): PostEntity {
    return new PostEntity({ ...dto });
  }

  entityToDto(post: PostEntity): CreatePostInput {
    return new CreatePostInput({ ...post });
  }
}
