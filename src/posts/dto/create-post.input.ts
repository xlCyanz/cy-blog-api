import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { MessageCode } from "@/constants";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreatePostInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  content: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  image: string;

  @Field(() => Number)
  @IsNotEmpty({ message: MessageCode.USER_ID_REQUIRED })
  authorId: number;

  @Field(() => Number)
  @IsNotEmpty({ message: MessageCode.CATEGORY_ID_REQUIRED })
  categoryId: number;

  constructor(init?: Partial<CreatePostInput>) {
    Object.assign(this, init);
  }
}
