import { EmployeeRoles } from "src/common/enums/roles";
export declare const META_EMPLOYEE_ROLES = "employee_roles";
export declare const employeeRoleProtected: (...args: EmployeeRoles[]) => import("@nestjs/common").CustomDecorator<string>;
