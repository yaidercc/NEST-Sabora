"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRoleGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_1 = require("../../../common/enums/roles");
const employee_role_protected_decorator_1 = require("../../decorators/employee-role-protected.decorator");
const role_protected_decorator_1 = require("../../../user/decorators/role-protected.decorator");
let EmployeeRoleGuard = class EmployeeRoleGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const userRoles = this.reflector.get(role_protected_decorator_1.META_ROLES, context.getHandler());
        const employeeRoles = this.reflector.get(employee_role_protected_decorator_1.META_EMPLOYEE_ROLES, context.getHandler());
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if ((userRoles?.length === 0 && employeeRoles?.length === 0) || (!userRoles && !employeeRoles))
            return true;
        if (userRoles && userRoles?.length !== 0) {
            if (userRoles?.includes(roles_1.GeneralRoles.ADMIN) && user.role?.name === roles_1.GeneralRoles.ADMIN)
                return true;
            if (userRoles?.includes(roles_1.GeneralRoles.CLIENT) && user.role?.name === roles_1.GeneralRoles.CLIENT)
                return true;
        }
        else if (user?.role?.name !== roles_1.GeneralRoles.EMPLOYEE) {
            return true;
        }
        if (employeeRoles?.includes(user.employee?.employee_role?.name))
            return true;
        throw new common_1.ForbiddenException(`You don´t have the permission to perform this action`);
    }
};
exports.EmployeeRoleGuard = EmployeeRoleGuard;
exports.EmployeeRoleGuard = EmployeeRoleGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], EmployeeRoleGuard);
//# sourceMappingURL=employee-role.guard.js.map