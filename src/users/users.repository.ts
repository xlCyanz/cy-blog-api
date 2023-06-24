import {
  HttpStatus,
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

import { MessageCode } from "@interfaces";
import { PrismaService } from "@/prisma/prisma.service";

import User from "./entities/user.entity";

@Injectable()
export default class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(newUser: User): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: { ...newUser, role: "user" },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          messageCode: MessageCode.USER_ALREADY_EXISTS,
        });
      }
      throw new BadRequestException(error);
    }
  }

  async update(updateUserInput: User): Promise<User> {
    try {
      return await this.prisma.user.update({
        data: updateUserInput,
        where: { id: updateUserInput.id },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(userId: number): Promise<User> {
    return await this.prisma.user.delete({ where: { id: userId } });
  }
}
