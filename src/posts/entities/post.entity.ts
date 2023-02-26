import slugify from "slugify";
import { Types } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import User from "@/users/entities/user.entity";
import Category from "@/categories/entities/category.entity";

@ObjectType({ description: "Post entity" })
@Schema({ timestamps: true })
export class Post {
  @Field(() => String, { description: "Post identifier" })
  _id: Types.ObjectId;

  @Field(() => String, { description: "Post title" })
  @Prop({ required: true })
  title: string;

  @Field(() => String, { description: "Post content" })
  @Prop({ required: true })
  content: string;

  @Field(() => String, { description: "Post image", nullable: true })
  @Prop({ required: true })
  image: string;

  @Field(() => User, { description: "Post author" })
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  author: User;

  @Field(() => Category, { description: "Post category" })
  @Prop({
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  })
  category?: Category;

  @Field(() => String, { description: "Post slug", nullable: true })
  @Prop()
  slug?: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  constructor(init?: Partial<Post>) {
    Object.assign(this, init);
  }
}

export type PostDocument = Document & Post;
export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre("save", function (next) {
  if (!this.slug && this.isNew) {
    this.slug = slugify(`${this.title}${this.author.firstname}`, {
      lower: true,
      trim: true,
    });
  }

  next();
});
