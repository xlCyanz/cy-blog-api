import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import PrismaModule from "@/prisma/prisma.module";
import UsersModule from "@/users/users.module";
import ConfigModule from "@/config/config.module";

import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "F",
      signOptions: { expiresIn: "1d" }, // e.g. 30s, 7d, 24h
    }),
    UsersModule,
    ConfigModule,
    PrismaModule,
  ],
  providers: [AuthResolver, AuthService, JwtAuthGuard, JwtStrategy],
})
export default class AuthModule {}
