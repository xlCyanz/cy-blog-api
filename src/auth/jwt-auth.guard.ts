import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import {
  HttpStatus,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

import { MessageCode } from "@/constants";
import { ConfigService } from "@/config/config.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private configService: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const token = this.extractTokenFromHeader(ctx);

    if (!token) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        messageCode: MessageCode.TOKEN_REQUIRED,
      });
    }

    try {
      const payload = jwt.verify(
        token,
        this.configService.get("JWT_SECRET"),
      ) as JwtPayload;

      ctx.getContext().req["user"] = { id: payload?.userId } ?? undefined;
    } catch {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        messageCode: MessageCode.TOKEN_INVALID,
      });
    }

    return true;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private extractTokenFromHeader(ctx: GqlExecutionContext): string | undefined {
    const [type, token] =
      ctx.getContext().req.headers.authorization?.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }
}
