import { Module } from "@nestjs/common";
import { UsersMapper } from "./users.mapper";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersRepository } from "./users.repository";
import { User, UserSchema } from "./entities/user.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersResolver, UsersService, UsersRepository, UsersMapper],
})
export class UsersModule {}
