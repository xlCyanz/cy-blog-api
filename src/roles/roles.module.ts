import { Module } from "@nestjs/common";

import PrismaModule from "../prisma/prisma.module";

import { RolesMapper } from "./roles.mapper";
import { RolesService } from "./roles.service";
import { RolesResolver } from "./roles.resolver";
import { RolesRepository } from "./roles.repository";

@Module({
  imports: [PrismaModule],
  providers: [RolesResolver, RolesService, RolesRepository, RolesMapper],
})
export default class RolesModule {}
