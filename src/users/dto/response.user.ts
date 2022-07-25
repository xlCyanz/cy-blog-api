import { User } from "../entities/user.entity";
import { BaseResponse } from "../../response.dto";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "User response" })
export class ResponseUser extends BaseResponse {
  @Field(() => User)
  data?: User;

  constructor(init?: Partial<ResponseUser>) {
    super();
    Object.assign(this, init);
  }
}
