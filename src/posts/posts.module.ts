import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PostsMapper } from "./posts.mapper";
import { PostsService } from "./posts.service";
import { PostsResolver } from "./posts.resolver";
import { PostsRepository } from "./posts.repository";
import { Post, PostSchema } from "./entities/post.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostsResolver, PostsService, PostsRepository, PostsMapper],
})
export class PostsModule {}
