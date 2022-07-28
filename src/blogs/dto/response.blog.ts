import { Blog } from "../entities/blog.entity";
import { BaseResponse } from "../../response.dto";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "Blog response" })
export class ResponseBlog extends BaseResponse {
  @Field(() => Blog)
  data?: Blog;

  constructor(init?: Partial<ResponseBlog>) {
    super();
    Object.assign(this, init);
  }
}

@ObjectType({ description: "Blogs response" })
export class ResponseCategories extends BaseResponse {
  @Field(() => [Blog], { nullable: true })
  data?: Blog[];

  constructor(init?: Partial<ResponseCategories>) {
    super();
    Object.assign(this, init);
  }
}
