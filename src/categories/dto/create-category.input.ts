import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  constructor(init?: Partial<CreateCategoryInput>) {
    Object.assign(this, init);
  }
}
