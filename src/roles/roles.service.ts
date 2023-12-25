import { Injectable } from "@nestjs/common";

import { RolesMapper } from "./roles.mapper";
import { CreateRoleInput } from "./dto/create-role.input";
import { UpdateRoleInput } from "./dto/update-role.input";
import { RolesRepository } from "./roles.repository";

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private rolesMapper: RolesMapper,
  ) {}

  findAll() {
    return this.rolesRepository.findAll();
  }

  findById(roleId: number) {
    return this.rolesRepository.findById(roleId);
  }

  create(createRoleInput: CreateRoleInput) {
    return this.rolesRepository.create(
      this.rolesMapper.dtoToEntity(createRoleInput),
    );
  }

  update(updateRoleInput: UpdateRoleInput) {
    return this.rolesRepository.update(
      this.rolesMapper.dtoToEntity(updateRoleInput),
    );
  }

  remove(roleId: number) {
    return this.rolesRepository.remove(roleId);
  }
}
