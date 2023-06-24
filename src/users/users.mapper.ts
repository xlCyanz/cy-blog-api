import { Injectable } from "@nestjs/common";

import { UserEntity } from "./entities/user.entity";
import CreateUserInput from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersMapper {
  dtoToEntity(dto: CreateUserInput | UpdateUserInput): UserEntity {
    return new UserEntity({ ...dto });
  }

  entityToDto(user: UserEntity): CreateUserInput {
    return new CreateUserInput({ ...user });
  }
}
