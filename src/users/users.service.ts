import { Utils } from "../utils";
import { Injectable } from "@nestjs/common";
import { UsersMapper } from "./users.mapper";
import { UsersRepository } from "./users.repository";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private usersMapper: UsersMapper,
  ) {}

  private exceptionMessageInvalid = "User id is invalid";

  findById(userId: string) {
    return this.usersRepository.findById(
      Utils.stringToObjectId(userId, this.exceptionMessageInvalid),
    );
  }

  findByName(name: string) {
    return this.usersRepository.findByName(name);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  create(createUserInput: CreateUserInput) {
    return this.usersRepository.create(
      this.usersMapper.dtoToEntity(createUserInput),
    );
  }

  update(updateUserInput: UpdateUserInput) {
    return this.usersRepository.update(
      Utils.stringToObjectId(updateUserInput.id, this.exceptionMessageInvalid),
      this.usersMapper.dtoToEntity(updateUserInput),
    );
  }

  remove(userId: string) {
    return this.usersRepository.remove(
      Utils.stringToObjectId(userId, this.exceptionMessageInvalid),
    );
  }
}
