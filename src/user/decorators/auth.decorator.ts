import { applyDecorators, UseGuards } from '@nestjs/common';
import { GeneralRoles } from '../enums/roles';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { AllowOwnerOrAdmin, OwnerAminOptions } from './owner-protected.decorator';
import { IsOwnerOrAdminGuard } from '../guards/is-owner-or-admin/is-owner-or-admin.guard';

export function Auth(roles?: GeneralRoles[], options?: OwnerAminOptions) {
  const decorators = [
    UseGuards(AuthGuard()),

  ];

  if (roles && roles.length > 0) {
    decorators.unshift(RoleProtected(...roles));
    decorators.push(UseGuards(UserRoleGuard));
  }

  if (options) {
    decorators.unshift(AllowOwnerOrAdmin(options));
    decorators.push(UseGuards(IsOwnerOrAdminGuard));
  }

  return applyDecorators(...decorators);
}
