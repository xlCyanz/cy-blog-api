import { Document, Types } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType({ description: "Category entity" })
@Schema({ timestamps: true })
export class Category {
  @Field(() => String, { description: "Category identifier" })
  _id: Types.ObjectId | string;

  @Field(() => String, { description: "Category name" })
  @Prop({
    required: true,
    index: true,
    message: "Category name is required",
    unique: true,
  })
  name: string;

  @Field(() => String, { description: "Category description", nullable: true })
  @Prop({
    required: false,
    message: "Category description is required",
  })
  description: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  constructor(init?: Partial<Category>) {
    Object.assign(this, init);
  }
}

export type CategoryDocument = Document & Category;
export const CategorySchema = SchemaFactory.createForClass(Category);
