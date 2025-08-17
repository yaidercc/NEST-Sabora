import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { GeneralRoles } from 'src/common/enums/roles';
import { META_EMPLOYEE_ROLES } from 'src/employee/decorators/employee-role-protected.decorator';
import { META_ROLES } from 'src/user/decorators/role-protected.decorator';

@Injectable()
export class EmployeeRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    const employeeRoles: string[] = this.reflector.get(META_EMPLOYEE_ROLES, context.getHandler());
    const req = context.switchToHttp().getRequest()
    const user = req.user;
    if ((userRoles?.length === 0 && employeeRoles?.length === 0) || (!userRoles && !employeeRoles)) return true
    
    if (userRoles && userRoles?.length !== 0) {
      if (userRoles?.includes(GeneralRoles.ADMIN) && user.role?.name === GeneralRoles.ADMIN) return true;
      if (userRoles?.includes(GeneralRoles.CLIENT) && user.role?.name === GeneralRoles.CLIENT) return true
      
    } else if(user?.role?.name !== GeneralRoles.EMPLOYEE){
      return true
    }

    if (employeeRoles?.includes(user.employee?.employee_role?.name)) return true;
    
    throw new ForbiddenException(`You don´t have the permission to perform this action`)



  }
}
