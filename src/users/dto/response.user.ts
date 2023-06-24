import { Field, ObjectType } from "@nestjs/graphql";

import { BaseResponse } from "@/response.dto";

import User from "../entities/user.entity";

@ObjectType({ description: "User response" })
export default class ResponseUser extends BaseResponse {
  @Field(() => User)
  data?: User;

  constructor(init?: Partial<ResponseUser>) {
    super();
    Object.assign(this, init);
  }
}
