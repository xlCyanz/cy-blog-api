import { Injectable } from "@nestjs/common";

import { RoleEntity } from "./entities/role.entity";
import { CreateRoleInput } from "./dto/create-role.input";
import { UpdateRoleInput } from "./dto/update-role.input";

@Injectable()
export class RolesMapper {
  dtoToEntity(dto: CreateRoleInput | UpdateRoleInput): RoleEntity {
    return new RoleEntity({ ...dto });
  }

  entityToDto(Role: RoleEntity): CreateRoleInput {
    return new CreateRoleInput({ ...Role });
  }
}
