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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("./entities/user.entity");
const auth_decorator_1 = require("./decorators/auth.decorator");
const get_user_decorator_1 = require("./decorators/get-user.decorator");
const login_user_dto_1 = require("./dto/login-user.dto");
const userResponses_1 = require("./interfaces/userResponses");
const reset_password_dto_1 = require("./dto/reset.password.dto");
const roles_1 = require("../common/enums/roles");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    login(loginUserDto) {
        return this.userService.login(loginUserDto);
    }
    findAll() {
        return this.userService.findAll();
    }
    sendEmailToResetPassword(requestTempPasswordDto) {
        return this.userService.requestTempPassword(requestTempPasswordDto);
    }
    changePassword(newPassword, user) {
        return this.userService.changePassword(newPassword, user);
    }
    profile(user) {
        return user;
    }
    findOne(term) {
        return this.userService.findOne(term);
    }
    update(id, updateUserDto) {
        return this.userService.update(id, updateUserDto);
    }
    remove(id) {
        return this.userService.remove(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create an user" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "User was created", type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "User login" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User logged", type: userResponses_1.UserLogin }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "email or password are incorrect" }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all users" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Users", type: [user_entity_1.User] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN], { allowAdmin: true }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Set and request temporal password" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "If the user exists, a temporary password has been sent to your email.", }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)("request-temp-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.RequestTempPasswordDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "sendEmailToResetPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Change user password" }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password changed successfully" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Passwords do not match" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)("change-password"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.NewPassword, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Set and request temporal password" }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User", type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.Get)("profile"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "profile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Find one user by a search term" }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User", type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN], { allowAdmin: true }),
    (0, common_1.Get)(':term'),
    __param(0, (0, common_1.Param)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update an user" }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User updated successfully", type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found/The specified role does not exists" }),
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)([], { allowAdmin: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Delete an user" }),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN]),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map