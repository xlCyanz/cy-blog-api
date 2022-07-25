import { User } from "./entities/user.entity";
import { Injectable } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersMapper {
  dtoToEntity(dto: CreateUserInput | UpdateUserInput): User {
    return new User({ ...dto });
  }

  entityToDto(user: User): CreateUserInput {
    return new CreateUserInput({ ...user });
  }
}
