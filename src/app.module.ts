import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import UsersModule from "@users/users.module";
import PostsModule from "@posts/posts.module";
import PrismaModule from "./prisma/prisma.module";
import ConfigModule from "@config/config.module";
import CategoriesModule from "@categories/categories.module";

import { AppController } from "./app.controller";
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
    }),
    PrismaModule,
    CategoriesModule,
    UsersModule,
    PostsModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
