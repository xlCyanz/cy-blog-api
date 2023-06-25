import { Field, Int, ObjectType } from "@nestjs/graphql";

import { IMessageCode } from "./interfaces";

@ObjectType()
export class BaseResponse {
  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  messageCode: IMessageCode;
}
