import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: "Category name" })
  name: string;

  @Field(() => String, { description: "Category description", nullable: true })
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}
