import { Field, ObjectType } from "@nestjs/graphql";

import User from "../entities/user.entity";
import { BaseResponse } from "../../response.dto";

@ObjectType({ description: "User response" })
export default class ResponseUser extends BaseResponse {
  @Field(() => User)
  data?: User;

  constructor(init?: Partial<ResponseUser>) {
    super();
    Object.assign(this, init);
  }
}
