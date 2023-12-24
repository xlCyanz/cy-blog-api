import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "@users/entities/user.entity";
import { MessageCode } from "@/constants";
import { UsersService } from "@users/users.service";

import { LoginAuthInput } from "./dto/login-auth.input";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginAuthInput) {
    const userByEmail = await this.usersService.findByEmail(email);

    if (!userByEmail) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.USER_NOT_FOUND,
      });
    }

    const user = new UserEntity(userByEmail);

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        messageCode: MessageCode.PASSWORD_INVALID,
      });
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
