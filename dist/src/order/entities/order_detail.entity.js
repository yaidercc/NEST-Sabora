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
exports.OrderDetail = void 0;
const menu_item_entity_1 = require("../../menu_item/entities/menu_item.entity");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const swagger_1 = require("@nestjs/swagger");
let OrderDetail = class OrderDetail {
    id;
    quantity;
    menu_item;
    order;
    is_active;
};
exports.OrderDetail = OrderDetail;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order details id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderDetail.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order details quantity",
        example: 2
    }),
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], OrderDetail.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Menu item",
        type: () => menu_item_entity_1.MenuItem
    }),
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem, menu_item => menu_item.order_detail, {
        eager: true
    }),
    (0, typeorm_1.JoinColumn)({ name: 'menu_item_id' }),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], OrderDetail.prototype, "menu_item", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, order => order.order_details),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_1.Order)
], OrderDetail.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: true, select: false }),
    __metadata("design:type", Boolean)
], OrderDetail.prototype, "is_active", void 0);
exports.OrderDetail = OrderDetail = __decorate([
    (0, typeorm_1.Entity)("order_detail")
], OrderDetail);
//# sourceMappingURL=order_detail.entity.js.map