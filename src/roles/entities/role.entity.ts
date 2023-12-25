import { Role, RolesToUser } from "@prisma/client";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType({ description: "Role entity" })
export class RoleEntity implements Role {
  @Field(() => Number, { description: "Role identifier" })
  id: number;

  @Field(() => String, { description: "Role name" })
  name: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  constructor(init?: Partial<Role>) {
    Object.assign(this, init);
  }
}

@ObjectType({ description: "Role to user entity" })
export class RolesToUserEntity implements RolesToUser {
  @Field(() => Number, { description: "Role identifier" })
  roleId: number;

  @Field(() => Number, { description: "User id identifier" })
  userId: number;

  @Field(() => Boolean, { description: "Relation is active?" })
  isActive: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  constructor(init?: Partial<Role>) {
    Object.assign(this, init);
  }
}
