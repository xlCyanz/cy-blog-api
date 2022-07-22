import { Category } from "../entities/category.entity";
import { BaseResponse } from "../../response.dto";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({ description: "Category response" })
export class ResponseCategory extends BaseResponse {
  @Field(() => Category, { nullable: true })
  data?: Category;

  constructor(statusCode: number, message: string, data: Category) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

@ObjectType({ description: "Categories response" })
export class ResponseCategories extends BaseResponse {
  @Field(() => [Category], { nullable: true })
  data?: Category[];

  constructor(statusCode: number, message: string, data: Category[]) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
