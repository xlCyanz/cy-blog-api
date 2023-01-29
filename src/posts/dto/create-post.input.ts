import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  image: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String, { nullable: true })
  categoryId: string;

  constructor(init?: Partial<CreatePostInput>) {
    Object.assign(this, init);
  }
}
