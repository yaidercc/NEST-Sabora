"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRoleProtected = exports.META_EMPLOYEE_ROLES = void 0;
const common_1 = require("@nestjs/common");
exports.META_EMPLOYEE_ROLES = "employee_roles";
const employeeRoleProtected = (...args) => {
    return (0, common_1.SetMetadata)(exports.META_EMPLOYEE_ROLES, args);
};
exports.employeeRoleProtected = employeeRoleProtected;
//# sourceMappingURL=employee-role-protected.decorator.js.map