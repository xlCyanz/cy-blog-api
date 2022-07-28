import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateBlogInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => String, { nullable: true })
  image: string;

  @Field(() => String)
  author: string;

  @Field(() => String)
  category: string;

  constructor(init?: Partial<CreateBlogInput>) {
    Object.assign(this, init);
  }
}
