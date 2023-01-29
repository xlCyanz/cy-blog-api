import { Types } from "mongoose";
import { InputType, Field, PartialType, OmitType } from "@nestjs/graphql";

import { CreatePostInput } from "./create-post.input";

@InputType()
export class UpdatePostInput extends PartialType(
  OmitType(CreatePostInput, ["authorId", "categoryId"] as const),
) {
  @Field(() => String)
  _id: Types.ObjectId;
}
