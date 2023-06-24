import { Category } from "@prisma/client";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType({ description: "Category entity" })
export class CategoryEntity implements Category {
  @Field(() => String, { description: "Category identifier" })
  id: number;

  @Field(() => String, { description: "Category name" })
  name: string;

  @Field(() => String, { description: "Category description", nullable: true })
  description: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  constructor(init?: Partial<Category>) {
    Object.assign(this, init);
  }
}
