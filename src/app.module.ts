import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { UsersModule } from "./users/users.module";
import { BlogsModule } from "./blogs/blogs.module";
import { ConfigModule } from "./config/config.module";
import { AppController } from "./app.controller";
import { ConfigService } from "./config/config.service";
import { CategoriesModule } from "./categories/categories.module";
import { PostsModule } from './posts/posts.module';

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
    PostsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
