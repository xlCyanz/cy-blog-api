import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { BlogsModule } from "./blogs/blogs.module";
import { ConfigModule } from "./config/config.module";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { ConfigService } from "./config/config.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesModule } from "./categories/categories.module";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getMongoConfig(),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
    }),
    UsersModule,
    CategoriesModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
