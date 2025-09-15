"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemModule = void 0;
const common_1 = require("@nestjs/common");
const menu_item_service_1 = require("./menu_item.service");
const menu_item_controller_1 = require("./menu_item.controller");
const typeorm_1 = require("@nestjs/typeorm");
const menu_item_entity_1 = require("./entities/menu_item.entity");
const common_module_1 = require("../common/common.module");
const user_module_1 = require("../user/user.module");
let MenuItemModule = class MenuItemModule {
};
exports.MenuItemModule = MenuItemModule;
exports.MenuItemModule = MenuItemModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([menu_item_entity_1.MenuItem]), common_module_1.CommonModule, user_module_1.UserModule],
        controllers: [menu_item_controller_1.MenuItemController],
        providers: [menu_item_service_1.MenuItemService],
        exports: [typeorm_1.TypeOrmModule, menu_item_service_1.MenuItemService]
    })
], MenuItemModule);
//# sourceMappingURL=menu_item.module.js.map