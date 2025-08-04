import { SetMetadata } from '@nestjs/common';
import { GeneralRoles } from '../enums/roles';

export const META_ROLES = 'roles'

export const RoleProtected = (...args: GeneralRoles[]) => {
    return SetMetadata(META_ROLES, args); // this is additional data that will be part of the method identity, you can access it through all the method decorator's
}
