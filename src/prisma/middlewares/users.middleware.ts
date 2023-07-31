import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export function UserHashPasswordMiddleware<
  T extends Prisma.BatchPayload = Prisma.BatchPayload,
>(): Prisma.Middleware {
  return async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<T>,
  ): Promise<T> => {
    if (params.action == "create" && params.model == "User") {
      const user = params.args.data;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
      params.args.data = user;
    }
    return next(params);
  };
}
