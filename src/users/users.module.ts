import { Module } from "@nestjs/common";

import { PrismaModule } from "@/prisma/prisma.module";

import { UsersMapper } from "./users.mapper";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { UsersRepository } from "./users.repository";

@Module({
  imports: [PrismaModule],
  providers: [UsersResolver, UsersService, UsersRepository, UsersMapper],
})
export default class UsersModule {}
