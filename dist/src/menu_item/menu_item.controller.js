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
exports.MenuItemController = void 0;
const common_1 = require("@nestjs/common");
const menu_item_service_1 = require("./menu_item.service");
const create_menu_item_dto_1 = require("./dto/create-menu_item.dto");
const update_menu_item_dto_1 = require("./dto/update-menu_item.dto");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
const fileUpload_decorator_1 = require("../common/decorators/fileUpload.decorator");
const auth_decorator_1 = require("../user/decorators/auth.decorator");
const roles_1 = require("../common/enums/roles");
const swagger_1 = require("@nestjs/swagger");
const menu_item_entity_1 = require("./entities/menu_item.entity");
let MenuItemController = class MenuItemController {
    menuItemService;
    constructor(menuItemService) {
        this.menuItemService = menuItemService;
    }
    create(createMenuItemDto, file) {
        return this.menuItemService.create(createMenuItemDto, file);
    }
    findAll(paginationDto) {
        return this.menuItemService.findAll(paginationDto);
    }
    findOne(term) {
        return this.menuItemService.findOne(term);
    }
    update(id, updateMenuItemDto, file) {
        return this.menuItemService.update(id, updateMenuItemDto, file);
    }
    remove(id) {
        return this.menuItemService.remove(id);
    }
};
exports.MenuItemController = MenuItemController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: "Create a menu item" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "menu item created", type: menu_item_entity_1.MenuItem }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Menu item already exists" }),
    (0, swagger_1.ApiExtraModels)(create_menu_item_dto_1.CreateMenuItemDto),
    (0, swagger_1.ApiBody)({
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(create_menu_item_dto_1.CreateMenuItemDto) },
                {
                    type: 'object',
                    properties: {
                        file: {
                            type: 'string',
                            format: 'binary',
                            description: 'Image file - Max 5MB',
                        },
                    },
                },
            ],
        },
    }),
    (0, common_1.Post)(),
    (0, fileUpload_decorator_1.FileUploader)(),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN], {}, [roles_1.EmployeeRoles.MANAGER]),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_menu_item_dto_1.CreateMenuItemDto, Object]),
    __metadata("design:returntype", void 0)
], MenuItemController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all menu items" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Menu items", type: [menu_item_entity_1.MenuItem] }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MenuItemController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Find one menu item by a search term" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Menu item", type: menu_item_entity_1.MenuItem }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Menu item is not available" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Menu item not found" }),
    (0, common_1.Get)(':term'),
    __param(0, (0, common_1.Param)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuItemController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: "Update a menu item" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Menu item updated successfully", type: menu_item_entity_1.MenuItem }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Menu item is not available" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Menu item not found" }),
    (0, swagger_1.ApiExtraModels)(update_menu_item_dto_1.UpdateMenuItemDto),
    (0, swagger_1.ApiBody)({
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(update_menu_item_dto_1.UpdateMenuItemDto) },
                {
                    type: 'object',
                    properties: {
                        file: {
                            type: 'string',
                            format: 'binary',
                            description: 'Image file (optional) - Max 5MB',
                        },
                    },
                    required: [],
                },
            ],
            required: [],
        },
    }),
    (0, common_1.Patch)(':id'),
    (0, fileUpload_decorator_1.FileUploader)(),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN], {}, [roles_1.EmployeeRoles.MANAGER]),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_menu_item_dto_1.UpdateMenuItemDto, Object]),
    __metadata("design:returntype", void 0)
], MenuItemController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: "Delete a menu item" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Menu item deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Menu item not found" }),
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN], {}, [roles_1.EmployeeRoles.MANAGER]),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenuItemController.prototype, "remove", null);
exports.MenuItemController = MenuItemController = __decorate([
    (0, common_1.Controller)('menu-item'),
    __metadata("design:paramtypes", [menu_item_service_1.MenuItemService])
], MenuItemController);
//# sourceMappingURL=menu_item.controller.js.map