import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

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
