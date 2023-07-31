import { Post } from "@prisma/client";
import { ObjectType, Field } from "@nestjs/graphql";

import { ICategory, IUser } from "@interfaces";

import { UserEntity } from "@users/entities/user.entity";
import { CategoryEntity } from "@categories/entities/category.entity";

@ObjectType({ description: "Post entity" })
export class PostEntity implements Post {
  @Field(() => Number, { description: "Post identifier" })
  id: number;

  @Field(() => String, { description: "Post title" })
  title: string;

  @Field(() => String, { description: "Post body" })
  content: string;

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

  constructor({ author, category, ...init }: Partial<PostEntity>) {
    Object.assign(this, init);

    if (author) {
      this.author = new UserEntity(author);
    }

    if (category) {
      this.category = new CategoryEntity(category);
    }
  }
}
