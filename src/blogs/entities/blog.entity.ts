import slugify from "slugify";
import { User } from "../../users/entities/user.entity";
import { Types } from "mongoose";
import { Category } from "../../categories/entities/category.entity";
import { ObjectType, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType({ description: "Blog entity" })
@Schema({ timestamps: true })
export class Blog {
  @Field(() => String, { description: "Blog identifier" })
  _id: Types.ObjectId;

  @Field(() => String, { description: "Blog title" })
  @Prop({ required: true })
  title: string;

  @Field(() => String, { description: "Blog content" })
  @Prop({ required: true })
  content: string;

  @Field(() => String, { description: "Blog image", nullable: true })
  @Prop({ required: true })
  image: string;

  @Field(() => String, { description: "Blog slug", nullable: true })
  @Prop()
  slug: string;

  @Field(() => User, { description: "Blog author" })
  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  author: User;

  @Field(() => Category, { description: "Blog category" })
  @Prop({
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  })
  category: Category;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  constructor(init?: Partial<Blog>) {
    Object.assign(this, init);
  }
}

export type BlogDocument = Document & Blog;
export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.pre("save", function (next) {
  if (!this.slug && this.isNew) {
    this.slug = slugify(`${this.title}${this.author.firstname}`, {
      lower: true,
      trim: true,
    });
  }

  next();
});
