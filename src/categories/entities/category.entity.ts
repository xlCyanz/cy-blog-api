import { Document, Types } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType({ description: "Category entity" })
@Schema({ timestamps: true })
export class Category {
  @Field(() => String, { description: "Category identifier" })
  _id: Types.ObjectId;

  @Field(() => String, { description: "Category name" })
  @Prop({
    required: true,
    unique: true,
    message: "Category name is required",
  })
  name: string;

  @Field(() => String, { description: "Category description", nullable: true })
  @Prop({
    required: false,
    message: "Category description is required",
  })
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}

export type CategoryDocument = Document & Category;
export const CategorySchema = SchemaFactory.createForClass(Category);
