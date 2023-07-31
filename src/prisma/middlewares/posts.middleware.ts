import slugify from "slugify";
import { Prisma } from "@prisma/client";

import { Utilities } from "@/utils";

export function PostSlugifyTitleMiddleware<
  T extends Prisma.BatchPayload = Prisma.BatchPayload,
>(): Prisma.Middleware {
  return async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<T>,
  ): Promise<T> => {
    if (params.action == "create" && params.model == "Post") {
      const post = params.args.data;

      const slug = slugify(post.title, {
        lower: true,
        trim: true,
      });

      post.slug = `${slug}-${Utilities.genUUIDv4()}`;
      params.args.data = post;
    }
    return next(params);
  };
}
