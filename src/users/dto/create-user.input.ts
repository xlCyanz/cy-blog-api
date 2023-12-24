import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { MessageCode } from "@constants";

@InputType()
export default class CreateUserInput {
  @IsString()
  @IsNotEmpty({ message: MessageCode.USER_FIRST_NAME_REQUIRED })
  @Field(() => String)
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: MessageCode.USER_LAST_NAME_REQUIRED })
  @Field(() => String)
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: MessageCode.USER_PASSWORD_REQUIRED })
  @Field(() => String)
  password: string;

  @IsString()
  @IsNotEmpty({ message: MessageCode.USER_MAIL_REQUIRED })
  @IsEmail(undefined, { message: MessageCode.USER_MAIL_INVALID })
  @Field(() => String)
  email: string;

  @IsString()
  @Field(() => String, { nullable: true })
  dni?: string;

  constructor(init?: Partial<CreateUserInput>) {
    Object.assign(this, init);
  }
}
