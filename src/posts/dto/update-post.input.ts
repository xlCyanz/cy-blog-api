import { InputType, Field, PartialType, OmitType } from "@nestjs/graphql";

import { CreatePostInput } from "./create-post.input";
import { IsNotEmpty } from "class-validator";
import { MessageCode } from "@/constants";

@InputType()
export class UpdatePostInput extends PartialType(
  OmitType(CreatePostInput, ["authorId", "categoryId"] as const),
) {
  @Field(() => Number)
  @IsNotEmpty({ message: MessageCode.POST_ID_REQUIRED })
  id: number;

  @Field(() => Boolean)
  published: boolean;
}
