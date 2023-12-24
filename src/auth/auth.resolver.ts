import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthEntity } from "./entities/auth.entity";
import { LoginAuthInput } from "./dto/login-auth.input";
import { ResponseAuth } from "./dto/response.auth";
import { Response } from "@/interfaces";
import { HttpStatus } from "@nestjs/common";
import { MessageCode } from "@/constants";

@Resolver(() => AuthEntity)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => ResponseAuth)
  async login(
    @Args("input", { type: () => LoginAuthInput })
    input: LoginAuthInput,
  ): Promise<Response<AuthEntity>> {
    const data = await this.authService.login(input);

    return {
      data,
      statusCode: HttpStatus.OK,
      messageCode: MessageCode.SUCCESSFUL_SESSION,
    };
  }

  // @Query(() => Auth, { name: "auth" })
  // findOne(@Args("id", { type: () => Int }) id: number) {
  //   return this.authService.findOne(id);
  // }
}
