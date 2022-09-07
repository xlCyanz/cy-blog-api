import * as bcrypt from "bcrypt";
import { Date, Types } from "mongoose";
import { ObjectType, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType({ description: "User entity" })
@Schema({ timestamps: true })
export class User {
  @Field(() => String, { description: "User identifier" })
  _id: Types.ObjectId;

  @Field(() => String, { description: "First name" })
  @Prop({
    required: true,
    message: "First name is required",
  })
  firstname: string;

  @Field(() => String, { description: "Last name" })
  @Prop({
    required: true,
    message: "Last name is required",
  })
  lastname: string;

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
  @Prop({ message: "User role is required" })
  role: string;

  @Field(() => String, { description: "User avatar" })
  @Prop({ message: "User avatar is required" })
  avatar: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  public async comparePassword?(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}

export type UserDocument = Document & User;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    this.role = "user";
  }
  next();
});
