import { applyDecorators, UseGuards } from '@nestjs/common';
import { GeneralRoles } from '../enums/generalRole';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: GeneralRoles[]) {
  return applyDecorators(
   RoleProtected(...roles), // Define which roles are necesary for the route we are accesing
    UseGuards(AuthGuard(), UserRoleGuard)
  );
}