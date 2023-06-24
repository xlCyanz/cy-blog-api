import { Module } from "@nestjs/common";

import { PrismaModule } from "@/prisma/prisma.module";

import { PostsMapper } from "./posts.mapper";
import { PostsService } from "./posts.service";
import { PostsResolver } from "./posts.resolver";
import { PostsRepository } from "./posts.repository";

@Module({
  imports: [PrismaModule],
  providers: [PostsResolver, PostsService, PostsRepository, PostsMapper],
})
export class PostsModule {}
