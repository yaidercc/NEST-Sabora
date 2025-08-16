import { SetMetadata } from "@nestjs/common";
import { EmployeeRoles } from "src/common/enums/roles";

export const META_EMPLOYEE_ROLES = "employee_roles"

export const employeeRoleProtected = (...args: EmployeeRoles[]) => {
    return SetMetadata(META_EMPLOYEE_ROLES, args)
}