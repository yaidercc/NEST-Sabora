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
exports.IsOwnerOrAdminGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_1 = require("../../../common/enums/roles");
const owner_protected_decorator_1 = require("../../decorators/owner-protected.decorator");
let IsOwnerOrAdminGuard = class IsOwnerOrAdminGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        const { allowAdmin } = this.reflector.get(owner_protected_decorator_1.OWNER_ADMIN_KEY, context.getHandler());
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const id = req.params.id;
        if (!allowAdmin && user.role.name !== roles_1.GeneralRoles.ADMIN)
            return true;
        if (user.role.name === roles_1.GeneralRoles.ADMIN) {
            if (allowAdmin)
                return true;
            throw new common_1.ForbiddenException(`You don´t have the permission to perform this action`);
        }
        else if (id === user.id) {
            return true;
        }
        throw new common_1.ForbiddenException(`You don´t have the permission to perform this action`);
    }
};
exports.IsOwnerOrAdminGuard = IsOwnerOrAdminGuard;
exports.IsOwnerOrAdminGuard = IsOwnerOrAdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], IsOwnerOrAdminGuard);
//# sourceMappingURL=is-owner-or-admin.guard.js.map