import { MessageCode } from "@/interfaces";
import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

@InputType()
export default class CreateCategoryInput {
  @IsString()
  @IsNotEmpty({ message: MessageCode.CATEGORY_NAME_REQUIRED })
  @Field(() => String, { nullable: false })
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: MessageCode.CATEGORY_NAME_REQUIRED })
  @MaxLength(200)
  @Field(() => String, { nullable: true })
  description: string;

  constructor(init?: Partial<CreateCategoryInput>) {
    Object.assign(this, init);
  }
}
