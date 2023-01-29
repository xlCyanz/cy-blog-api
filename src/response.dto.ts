import { Field, Int, ObjectType } from "@nestjs/graphql";

import { MessageCode } from "@interfaces";

@ObjectType()
export class BaseResponse {
  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  messageCode: MessageCode;
}
