import { InputType, Field, PartialType } from "@nestjs/graphql";

import CreateCategoryInput from "./create-category.input";

@InputType()
export default class UpdateCategoryInput extends PartialType(
  CreateCategoryInput,
) {
  @Field(() => Number)
  id: number;
}
