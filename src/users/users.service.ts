import { Injectable } from "@nestjs/common";

import { UsersMapper } from "./users.mapper";
import { UsersRepository } from "./users.repository";
import CreateUserInput from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private usersMapper: UsersMapper,
  ) {}

  findById(userId: number) {
    return this.usersRepository.findById(userId);
  }

  findByEmail(userEmail: string) {
    return this.usersRepository.findByEmail(userEmail);
  }

  create(createUserInput: CreateUserInput) {
    return this.usersRepository.create(
      this.usersMapper.dtoToEntity(createUserInput),
    );
  }

  update(updateUserInput: UpdateUserInput) {
    return this.usersRepository.update(
      this.usersMapper.dtoToEntity(updateUserInput),
    );
  }

  remove(userId: number) {
    return this.usersRepository.remove(userId);
  }
}
