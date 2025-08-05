import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/user/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  // reflector: a service that help us access to the metadta of a method
  constructor(private readonly reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Collect the roles sended through metadata
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
    if (!validRoles) return true
    if (validRoles.length === 0) return true

    const req = context.switchToHttp().getRequest()
    const user = req.user;

    if (!user) throw new BadRequestException("User not found")


    if (validRoles.includes(user.role.name)) {
      return true
    }

    throw new ForbiddenException(`You don´t have the permission to perform this action222`)
  }
}
