import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OWNER_ADMIN_KEY } from 'src/user/decorators/owner-protected.decorator';
import { GeneralRoles } from 'src/user/enums/roles';

@Injectable()
export class IsOwnerOrAdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { allowAdmin } = this.reflector.get(OWNER_ADMIN_KEY, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user = req.user
    const id = req.params.id;

    if(!allowAdmin) return true

    if (user.role.name === GeneralRoles.admin) {
      if (allowAdmin) return true
      throw new ForbiddenException(`You don´t have the permission to perform this action`)
    } else if (id === user.id) {
      return true
    }

    throw new ForbiddenException(`You don´t have the permission to perform this action`)
  }
}
