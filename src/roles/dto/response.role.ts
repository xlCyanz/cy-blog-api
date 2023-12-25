import { Field, ObjectType } from "@nestjs/graphql";

import { BaseResponse } from "@/response.dto";

import { RoleEntity } from "../entities/role.entity";

@ObjectType({ description: "Role response" })
export class ResponseRole extends BaseResponse {
  @Field(() => RoleEntity)
  data?: RoleEntity;

  constructor(init?: Partial<ResponseRole>) {
    super();
    Object.assign(this, init);
  }
}

@ObjectType({ description: "Roles response" })
export class ResponseRoles extends BaseResponse {
  @Field(() => [RoleEntity], { nullable: true })
  data?: RoleEntity[];

  constructor(init?: Partial<ResponseRoles>) {
    super();
    Object.assign(this, init);
  }
}
