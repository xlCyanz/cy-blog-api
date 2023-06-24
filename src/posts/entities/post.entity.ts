import { Post } from "@prisma/client";
import { ObjectType, Field } from "@nestjs/graphql";

import { UserEntity } from "@/users/entities/user.entity";
import { CategoryEntity } from "@/categories/entities/category.entity";

@ObjectType({ description: "Post entity" })
export class PostEntity implements Post {
  @Field(() => String, { description: "Post identifier" })
  id: number;

  @Field(() => String, { description: "Post title" })
  title: string;

  @Field(() => String, { description: "Post body" })
  body: string;

  @Field(() => String, { description: "Post image", nullable: true })
  image: string;

  @Field(() => String, { description: "Post slug" })
  slug: string;

  @Field(() => Boolean, { description: "Post published state" })
  published: boolean;

  @Field(() => UserEntity, { description: "Post author" })
  authorId: number;

  @Field(() => CategoryEntity, { description: "Post category" })
  categoryId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  constructor(init?: Partial<Post>) {
    Object.assign(this, init);
  }
}
