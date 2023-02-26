import { Field, ObjectType } from "@nestjs/graphql";

import Category from "../entities/category.entity";
import { BaseResponse } from "../../response.dto";

@ObjectType({ description: "Category response" })
export class ResponseCategory extends BaseResponse {
  @Field(() => Category)
  data?: Category;

  constructor(init?: Partial<ResponseCategory>) {
    super();
    Object.assign(this, init);
  }
}

@ObjectType({ description: "Categories response" })
export class ResponseCategories extends BaseResponse {
  @Field(() => [Category], { nullable: true })
  data?: Category[];

  constructor(init?: Partial<ResponseCategories>) {
    super();
    Object.assign(this, init);
  }
}
