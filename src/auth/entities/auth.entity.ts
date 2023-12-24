import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthEntity {
  @Field(() => String, { description: "Example field (placeholder)" })
  accessToken: string;
}
