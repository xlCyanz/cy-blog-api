import { Blog } from "./entities/blog.entity";
import { Injectable } from "@nestjs/common";
import { CreateBlogInput } from "./dto/create-blog.input";
import { UpdateBlogInput } from "./dto/update-blog.input";

@Injectable()
export class BlogsMapper {
  dtoToEntity(dto: CreateBlogInput | UpdateBlogInput): Blog {
    return new Blog({ ...dto });
  }

  entityToDto(blog: Blog): CreateBlogInput {
    return new CreateBlogInput({ ...blog });
  }
}
