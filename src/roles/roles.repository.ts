import * as R from "radash";
import {
  Injectable,
  HttpStatus,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";

import { MessageCode } from "@constants";
import { PrismaService } from "@/prisma/prisma.service";

import { RoleEntity } from "./entities/role.entity";

@Injectable()
export class RolesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<RoleEntity[]> {
    return await this.prisma.role.findMany();
  }

  async findById(roleId: number): Promise<RoleEntity> {
    return await this.prisma.role.findUnique({ where: { id: roleId } });
  }

  async create(newRole: RoleEntity): Promise<RoleEntity> {
    try {
      return await this.prisma.role.create({ data: newRole });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          messageCode: MessageCode.ROLE_ALREADY_EXISTS,
        });
      }
      throw new BadRequestException(error);
    }
  }

  async update(updateRole: RoleEntity): Promise<RoleEntity> {
    try {
      return await this.prisma.role.update({
        data: R.omit(updateRole, ["id", "createdAt", "updatedAt"]),
        where: { id: updateRole.id },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(roleId: number) {
    return await this.prisma.role.delete({ where: { id: roleId } });
  }
}
