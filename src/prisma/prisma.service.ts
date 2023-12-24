import { Prisma, PrismaClient } from "@prisma/client";
import {
  Logger,
  Injectable,
  OnModuleInit,
  INestApplication,
} from "@nestjs/common";

import { UserHashPasswordMiddleware } from "./middlewares/users.middleware";
// import { PostSlugifyTitleMiddleware } from "./middlewares/posts.middleware";

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, "query" | "beforeExit">
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ log: [{ emit: "event", level: "query" }] });

    this.logger.log(`Prisma v${Prisma.prismaVersion.client}`);
    this.$on("query", (e) => this.logger.debug(`${e.query} ${e.params}`));

    this.$use(UserHashPasswordMiddleware());
    // this.$use(PostSlugifyTitleMiddleware());
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }

  // async onModuleInit() {
  //   await this.$connect();

  //   // Middlware user hash password
  //   this.$use(async (params, next) => {
  //     if (params.action == "create" && params.model == "User") {
  //       const user = params.args.data;
  //       const salt = bcrypt.genSaltSync(10);
  //       const hash = bcrypt.hashSync(user.password, salt);
  //       user.password = hash;
  //       params.args.data = user;
  //     }
  //     return next(params);
  //   });

  //   // Middleware slugify title post
  //   this.$use(async (params, next) => {
  //     if (params.action == "create" && params.model == "Post") {
  //       const post = params.args.data;

  //       const slug = slugify(post.title, {
  //         lower: true,
  //         trim: true,
  //       });

  //       post.slug = `${slug}-${Utilities.genUUIDv4()}`;
  //       params.args.data = post;
  //     }
  //     return next(params);
  //   });
  // }
}
