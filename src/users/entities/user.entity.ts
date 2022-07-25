import * as bcrypt from "bcrypt";
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
  @Prop({ message: "User role is required" })
  role: string;

  @Field(() => String, { description: "User avatar" })
  @Prop({ message: "User avatar is required" })
  avatar: string;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(27);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string) {
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
    this.password = await this.encryptPassword(this.password);
  }
  next();
});
