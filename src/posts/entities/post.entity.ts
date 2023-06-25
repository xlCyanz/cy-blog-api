import { Post } from "@prisma/client";
import { ObjectType, Field } from "@nestjs/graphql";

import { UserEntity } from "@users/entities/user.entity";
import { CategoryEntity } from "@categories/entities/category.entity";
import { ICategory, IUser } from "@interfaces";

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

  @Field(() => Number, { description: "Post author id", nullable: true })
  authorId: number;

  @Field(() => UserEntity, { description: "Post author", nullable: true })
  author?: IUser;

  @Field(() => Number, { description: "Post category id" })
  categoryId: number;

  @Field(() => CategoryEntity, { description: "Post category", nullable: true })
  category?: ICategory;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  constructor(init?: Partial<Post>) {
    Object.assign(this, init);
  }
}
