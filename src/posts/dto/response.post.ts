import { Field, ObjectType } from "@nestjs/graphql";

import { PostEntity } from "../entities/post.entity";
import { BaseResponse } from "../../response.dto";

@ObjectType({ description: "Post response" })
export class ResponsePost extends BaseResponse {
  @Field(() => PostEntity)
  data?: PostEntity;

  constructor(init?: Partial<ResponsePost>) {
    super();
    Object.assign(this, init);
  }
}

@ObjectType({ description: "Posts response" })
export class ResponsePosts extends BaseResponse {
  @Field(() => [PostEntity], { nullable: true })
  data?: PostEntity[];

  constructor(init?: Partial<ResponsePosts>) {
    super();
    Object.assign(this, init);
  }
}
