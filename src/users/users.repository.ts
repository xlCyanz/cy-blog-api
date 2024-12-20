import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";

import { MessageCode } from "@interfaces";

import User, { UserDocument } from "./entities/user.entity";

@Injectable()
export default class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: Types.ObjectId): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findByName(name: string): Promise<User> {
    return await this.userModel.findOne({ name });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async create(newUser: User): Promise<User> {
    try {
      return await this.userModel.create(newUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          messageCode: MessageCode.USER_ALREADY_EXISTS,
        });
      } else throw new BadRequestException(error);
    }
  }

  async update(userId: Types.ObjectId, updateUserInput: User): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(userId, updateUserInput, {
        new: true,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(userId: Types.ObjectId): Promise<User> {
    return await this.userModel.findByIdAndDelete(userId);
  }
}
