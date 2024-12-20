import { Injectable } from "@nestjs/common";

import { MessageCode } from "@interfaces";
import { MongooseUtils } from "@utils";

import UsersMapper from "./users.mapper";
import UsersRepository from "./users.repository";
import CreateUserInput from "./dto/create-user.input";
import UpdateUserInput from "./dto/update-user.input";

@Injectable()
export default class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private usersMapper: UsersMapper,
  ) {}

  findById(userId: string) {
    return this.usersRepository.findById(
      MongooseUtils.stringToObjectId(userId, MessageCode.USER_ID_INVALID),
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
      MongooseUtils.stringToObjectId(
        updateUserInput._id,
        MessageCode.USER_ID_INVALID,
      ),
      this.usersMapper.dtoToEntity(updateUserInput),
    );
  }

  remove(userId: string) {
    return this.usersRepository.remove(
      MongooseUtils.stringToObjectId(userId, MessageCode.USER_ID_INVALID),
    );
  }
}
