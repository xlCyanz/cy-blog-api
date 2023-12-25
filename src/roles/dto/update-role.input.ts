import { InputType, Field, PartialType } from "@nestjs/graphql";

import { CreateRoleInput } from "./create-role.input";

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @Field(() => Number)
  id: number;
}