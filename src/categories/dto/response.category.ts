import { Field, ObjectType } from "@nestjs/graphql";

import { BaseResponse } from "@/response.dto";

import { CategoryEntity } from "../entities/category.entity";

@ObjectType({ description: "Category response" })
export class ResponseCategory extends BaseResponse {
  @Field(() => CategoryEntity)
  data?: CategoryEntity;

  constructor(init?: Partial<ResponseCategory>) {
    super();
    Object.assign(this, init);
  }
}

@ObjectType({ description: "Categories response" })
export class ResponseCategories extends BaseResponse {
  @Field(() => [CategoryEntity], { nullable: true })
  data?: CategoryEntity[];

  constructor(init?: Partial<ResponseCategories>) {
    super();
    Object.assign(this, init);
  }
}
