import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  image: string;

  @Field(() => Number)
  authorId: number;

  @Field(() => Number)
  categoryId: number;

  constructor(init?: Partial<CreatePostInput>) {
    Object.assign(this, init);
  }
}
