import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType({ description: "User entity" })
export class UserEntity implements User {
  @Field(() => Number, { description: "User identifier" })
  id: number;

  @Field(() => String, { description: "First name" })
  firstName: string;

  @Field(() => String, { description: "Last name" })
  lastName: string;

  @Field(() => String, { description: "User password" })
  password: string;

  @Field(() => String, { description: "User email" })
  email: string;

  @Field(() => String, { description: "User role" })
  role: string;

  @Field(() => String, { description: "User avatar" })
  avatar: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | null;

  public async comparePassword?(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
