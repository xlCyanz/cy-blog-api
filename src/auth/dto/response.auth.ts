import { Field, ObjectType } from "@nestjs/graphql";

import { BaseResponse } from "@/response.dto";
import { AuthEntity } from "../entities/auth.entity";

@ObjectType({ description: "Auth response" })
export class ResponseAuth extends BaseResponse {
  @Field(() => AuthEntity)
  data?: AuthEntity;

  constructor(init?: Partial<ResponseAuth>) {
    super();
    Object.assign(this, init);
  }
}
