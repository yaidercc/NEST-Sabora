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
exports.MenuItem = void 0;
const typeorm_1 = require("typeorm");
const menu_item_type_1 = require("../enum/menu_item_type");
const swagger_1 = require("@nestjs/swagger");
const order_detail_entity_1 = require("../../order/entities/order_detail.entity");
let MenuItem = class MenuItem {
    id;
    name;
    description;
    price;
    menu_item_type;
    image;
    is_active;
    order_detail;
};
exports.MenuItem = MenuItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], MenuItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item name",
        example: "Sancocho"
    }),
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], MenuItem.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item description",
        example: "Delicioso sancocho tradicional colombiano"
    }),
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], MenuItem.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item price",
        example: 25.000
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], MenuItem.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item type",
        example: menu_item_type_1.MenuItemType.MAIN_COURSE
    }),
    (0, typeorm_1.Column)({ type: "simple-enum", enum: menu_item_type_1.MenuItemType }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], MenuItem.prototype, "menu_item_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item image",
        example: "https://image.com/image.jpg"
    }),
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], MenuItem.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: true, select: false }),
    __metadata("design:type", Boolean)
], MenuItem.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_detail_entity_1.OrderDetail, order_detail => order_detail.menu_item),
    __metadata("design:type", order_detail_entity_1.OrderDetail)
], MenuItem.prototype, "order_detail", void 0);
exports.MenuItem = MenuItem = __decorate([
    (0, typeorm_1.Entity)("menu_item")
], MenuItem);
//# sourceMappingURL=menu_item.entity.js.map