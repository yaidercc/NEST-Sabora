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
exports.Order = void 0;
const table_entity_1 = require("../../table/entities/table.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const order_status_1 = require("../enum/order_status");
const order_detail_entity_1 = require("./order_detail.entity");
const swagger_1 = require("@nestjs/swagger");
let Order = class Order {
    id;
    user;
    customer;
    table;
    order_details;
    status;
    is_customer_order;
    date;
    subtotal;
    is_active;
};
exports.Order = Order;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User who made the order",
        type: () => () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.order, { eager: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Customer for whom the order is intended",
        type: () => user_entity_1.User,
        required: false
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true, nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Table where the order was placed",
        type: () => table_entity_1.Table
    }),
    (0, typeorm_1.ManyToOne)(() => table_entity_1.Table, table => table.order, { eager: true }),
    __metadata("design:type", table_entity_1.Table)
], Order.prototype, "table", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order details",
        type: () => order_detail_entity_1.OrderDetail
    }),
    (0, typeorm_1.OneToMany)(() => order_detail_entity_1.OrderDetail, order_detail => order_detail.order, {
        eager: true,
        cascade: true
    }),
    __metadata("design:type", Array)
], Order.prototype, "order_details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order status",
        enum: order_status_1.OrderStatus
    }),
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: order_status_1.OrderStatus, default: order_status_1.OrderStatus.PENDING }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Is a order made by a customer",
        example: true
    }),
    (0, typeorm_1.Column)("boolean"),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Boolean)
], Order.prototype, "is_customer_order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order date",
        example: "2020-10-10"
    }),
    (0, typeorm_1.Column)("date"),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Order.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order subtotal",
        example: 12.0000
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: true, select: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "is_active", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)("order")
], Order);
//# sourceMappingURL=order.entity.js.map