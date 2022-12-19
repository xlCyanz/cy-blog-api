import { MessageCode } from "./interfaces";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BaseResponse {
  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  messageCode: MessageCode;
}
