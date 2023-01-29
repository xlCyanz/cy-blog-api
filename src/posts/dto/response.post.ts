import { Field, ObjectType } from "@nestjs/graphql";

import { Post } from "../entities/post.entity";
import { BaseResponse } from "../../response.dto";

@ObjectType({ description: "Post response" })
export class ResponsePost extends BaseResponse {
  @Field(() => Post)
  data?: Post;

  constructor(init?: Partial<ResponsePost>) {
    super();
    Object.assign(this, init);
  }
}

@ObjectType({ description: "Posts response" })
export class ResponsePosts extends BaseResponse {
  @Field(() => [Post], { nullable: true })
  data?: Post[];

  constructor(init?: Partial<ResponsePosts>) {
    super();
    Object.assign(this, init);
  }
}
