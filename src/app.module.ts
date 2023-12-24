import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import PdfModule from "./pdf/pdf.module";
import UsersModule from "@users/users.module";
import AuthModule from "./auth/auth.module";
import PrismaModule from "./prisma/prisma.module";
import ConfigModule from "@config/config.module";
import CategoriesModule from "@categories/categories.module";

import { AppController } from "./app.controller";

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
    // PostsModule,
    PdfModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
