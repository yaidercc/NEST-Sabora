"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_role_guard_1 = require("../guards/user-role/user-role.guard");
const role_protected_decorator_1 = require("./role-protected.decorator");
const owner_protected_decorator_1 = require("./owner-protected.decorator");
const is_owner_or_admin_guard_1 = require("../guards/is-owner-or-admin/is-owner-or-admin.guard");
const employee_role_protected_decorator_1 = require("../../employee/decorators/employee-role-protected.decorator");
const employee_role_guard_1 = require("../../employee/guards/employee-role/employee-role.guard");
function Auth(roles, options, employeeRoles) {
    const decorators = [
        (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    ];
    if (roles && roles.length > 0) {
        decorators.unshift((0, role_protected_decorator_1.RoleProtected)(...roles));
        decorators.push((0, common_1.UseGuards)(user_role_guard_1.UserRoleGuard));
    }
    if (options && Object.values(options).length > 0) {
        decorators.unshift((0, owner_protected_decorator_1.AllowOwnerOrAdmin)(options));
        decorators.push((0, common_1.UseGuards)(is_owner_or_admin_guard_1.IsOwnerOrAdminGuard));
    }
    if (employeeRoles) {
        decorators.unshift((0, employee_role_protected_decorator_1.employeeRoleProtected)(...employeeRoles));
        decorators.push((0, common_1.UseGuards)(employee_role_guard_1.EmployeeRoleGuard));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
//# sourceMappingURL=auth.decorator.js.map