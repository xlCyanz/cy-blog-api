import { MessageCode } from "@/constants";
import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class LoginAuthInput {
  @IsString()
  @IsNotEmpty({ message: MessageCode.EMAIL_REQUIRED })
  @Field(() => String, { nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty({ message: MessageCode.PASSWORD_REQUIRED })
  @Field(() => String, { nullable: false })
  password: string;
}
