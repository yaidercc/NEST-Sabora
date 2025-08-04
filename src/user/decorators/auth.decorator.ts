import { applyDecorators, UseGuards } from '@nestjs/common';
import { GeneralRoles } from '../enums/roles';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { AllowOwnerOrAdmin, OwnerAminOptions } from './owner-protected.decorator';
import { IsOwnerOrAdminGuard } from '../guards/is-owner-or-admin/is-owner-or-admin.guard';

export function Auth(roles: GeneralRoles[], options: OwnerAminOptions) {
  return applyDecorators(
    RoleProtected(...roles), // Define which roles are necesary for the route we are accesing
    AllowOwnerOrAdmin(options),
    UseGuards(AuthGuard(), UserRoleGuard, IsOwnerOrAdminGuard)
  );
}