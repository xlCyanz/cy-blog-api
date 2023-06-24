import slugify from "slugify";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Middlware user hash password
    this.$use(async (params, next) => {
      if (params.action == "create" && params.model == "User") {
        const user = params.args.data;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        params.args.data = user;
      }
      return next(params);
    });

    // Middleware slugify title post
    this.$use(async (params, next) => {
      if (params.action == "create" && params.model == "Post") {
        const post = params.args.data;

        const slug = slugify(post.title, {
          lower: true,
          trim: true,
        });

        post.password = slug;
        params.args.data = post;
      }
      return next(params);
    });
  }
}
