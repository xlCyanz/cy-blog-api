import { Module } from "@nestjs/common";
import { BlogsMapper } from "./blogs.mapper";
import { BlogsService } from "./blogs.service";
import { BlogsResolver } from "./blogs.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsRepository } from "./blogs.repository";
import { Blog, BlogSchema } from "./entities/blog.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  providers: [BlogsResolver, BlogsService, BlogsRepository, BlogsMapper],
})
export class BlogsModule {}
