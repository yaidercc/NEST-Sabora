import { GeneralRoles } from 'src/common/enums/roles';
export declare const META_ROLES = "roles";
export declare const RoleProtected: (...args: GeneralRoles[]) => import("@nestjs/common").CustomDecorator<string>;
