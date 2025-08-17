import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { AllowOwnerOrAdmin, OwnerAminOptions } from './owner-protected.decorator';
import { IsOwnerOrAdminGuard } from '../guards/is-owner-or-admin/is-owner-or-admin.guard';
import { EmployeeRoles, GeneralRoles } from 'src/common/enums/roles';
import { employeeRoleProtected } from '../../employee/decorators/employee-role-protected.decorator';
import { EmployeeRoleGuard } from 'src/employee/guards/employee-role/employee-role.guard';

export function Auth(roles?: GeneralRoles[], options?: OwnerAminOptions, employeeRoles?: EmployeeRoles[], ) {
  const decorators = [
    UseGuards(AuthGuard()),
  ];

  if (roles && roles.length > 0) {
    decorators.unshift(RoleProtected(...roles));
    decorators.push(UseGuards(UserRoleGuard));
  }

  if (options && Object.values(options).length > 0) {
    decorators.unshift(AllowOwnerOrAdmin(options));
    decorators.push(UseGuards(IsOwnerOrAdminGuard));
  }

  if (employeeRoles) {
    decorators.unshift(employeeRoleProtected(...employeeRoles));
    decorators.push(UseGuards(EmployeeRoleGuard));
  }

  return applyDecorators(...decorators);
}
