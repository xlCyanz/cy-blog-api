import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

import { MessageCode } from "@constants";

@InputType()
export class CreateRoleInput {
  @IsString()
  @IsNotEmpty({ message: MessageCode.ROLE_NAME_REQUIRED })
  @Field(() => String, { nullable: false })
  name: string;

  constructor(init?: Partial<CreateRoleInput>) {
    Object.assign(this, init);
  }
}
