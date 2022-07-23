import { Date, Types } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType({ description: "User entity" })
@Schema({ timestamps: true })
export class User {
  @Field(() => String, { description: "User identifier" })
  _id: Types.ObjectId;

  @Field(() => String, { description: "User name" })
  @Prop({
    required: true,
    unique: true,
    message: "User name is required",
  })
  name: string;

  @Field(() => String, { description: "User password" })
  @Prop({
    required: true,
    message: "User password is required",
  })
  password: string;

  @Field(() => String, { description: "User email" })
  @Prop({
    required: true,
    unique: true,
    message: "User email is required",
  })
  email: string;

  @Field(() => String, { description: "User role" })
  @Prop({
    message: "User role is required",
  })
  role: string;

  @Field(() => String, { description: "User avatar" })
  @Prop({
    message: "User avatar is required",
  })
  avatar: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}

export type UserDocument = Document & User;
export const UserSchema = SchemaFactory.createForClass(User);
