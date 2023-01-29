import { InputType, Field } from "@nestjs/graphql";

@InputType()
export default class CreateUserInput {
  @Field(() => String)
  firstname: string;

  @Field(() => String)
  lastname: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  avatar: string;

  constructor(init?: Partial<CreateUserInput>) {
    Object.assign(this, init);
  }
}
