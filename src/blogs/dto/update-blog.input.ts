import { CreateBlogInput } from "./create-blog.input";
import { InputType, Field, PartialType, OmitType } from "@nestjs/graphql";

@InputType()
export class UpdateBlogInput extends PartialType(
  OmitType(CreateBlogInput, ["author", "category"] as const),
) {
  @Field(() => String)
  _id: string;
}
