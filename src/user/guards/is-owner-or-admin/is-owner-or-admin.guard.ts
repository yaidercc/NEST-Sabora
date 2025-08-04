import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { OWNER_ADMIN_KEY } from 'src/user/decorators/owner-protected.decorator';

@Injectable()
export class IsOwnerOrAdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowAdmin = this.reflector.get(OWNER_ADMIN_KEY, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user = req.user
    const term = req.params.term;

    // TODO: findone service
    const userToFind = null;


    // if(userToFind.id === user.id || user.role.name === GeneralRoles.admin) return true
    return true
    throw new ForbiddenException(`You don´t have the permission to perform this action`)
  }
}
