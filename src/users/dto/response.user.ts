import { Field, ObjectType } from "@nestjs/graphql";

import { BaseResponse } from "@/response.dto";

import { UserEntity } from "../entities/user.entity";

@ObjectType({ description: "User response" })
export class ResponseUser extends BaseResponse {
  @Field(() => UserEntity)
  data?: UserEntity;

  constructor(init?: Partial<ResponseUser>) {
    super();
    Object.assign(this, init);
  }
}
