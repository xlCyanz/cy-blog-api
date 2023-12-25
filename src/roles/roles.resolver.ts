import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { Response } from "@interfaces";
import { MessageCode } from "@constants";

import { RoleEntity } from "./entities/role.entity";
import { RolesService } from "./roles.service";
import { CreateRoleInput } from "./dto/create-role.input";
import { UpdateRoleInput } from "./dto/update-role.input";
import { ResponseRole, ResponseRoles } from "./dto/response.role";

@Resolver(() => RoleEntity)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => ResponseRoles, { name: "roles" })
  async findAll(): Promise<Response<RoleEntity[]>> {
    const roles = await this.rolesService.findAll();

    if (!roles.length) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.ROLES_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.ROLES_FOUND,
      data: roles,
    };
  }

  @Query(() => ResponseRole, { name: "role" })
  async findById(
    @Args("id", { type: () => Number }) roleId: number,
  ): Promise<Response<RoleEntity>> {
    if (!roleId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.ROLE_ID_REQUIRED,
      });
    }

    const role = await this.rolesService.findById(roleId);

    if (!role) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        messageCode: MessageCode.ROLE_NOT_FOUND,
      });
    }

    return {
      statusCode: HttpStatus.FOUND,
      messageCode: MessageCode.ROLE_FOUND,
      data: role,
    };
  }

  @Mutation(() => ResponseRole)
  async createRole(
    @Args("input", { type: () => CreateRoleInput })
    input: CreateRoleInput,
  ): Promise<Response<RoleEntity>> {
    const newRole = await this.rolesService.create(input);

    return {
      statusCode: HttpStatus.CREATED,
      messageCode: MessageCode.ROLE_CREATED,
      data: newRole,
    };
  }

  @Mutation(() => ResponseRole)
  async updateRole(
    @Args("input") input: UpdateRoleInput,
  ): Promise<Response<RoleEntity>> {
    if (!input.id) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.ROLE_ID_REQUIRED,
      });
    }

    try {
      const roleUpdated = await this.rolesService.update(input);

      return {
        statusCode: HttpStatus.OK,
        messageCode: MessageCode.ROLE_UPDATED,
        data: roleUpdated,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }

  @Mutation(() => ResponseRole)
  async removeRole(
    @Args("id", { type: () => Number }) roleId: number,
  ): Promise<Response<RoleEntity>> {
    if (!roleId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: MessageCode.ROLE_ID_REQUIRED,
      });
    }

    try {
      const roleRemoved = await this.rolesService.remove(roleId);

      if (!roleRemoved) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          messageCode: MessageCode.ROLE_NOT_FOUND,
        });
      }

      return {
        statusCode: HttpStatus.OK,
        messageCode: MessageCode.ROLE_REMOVED,
        data: roleRemoved,
      };
    } catch (error) {
      throw new BadRequestException({
        ...error.response,
      });
    }
  }
}
