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
exports.CreateOrderDto = exports.CreateOrderDetailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateOrderDetailDto {
    quantity;
    menu_item;
}
exports.CreateOrderDetailDto = CreateOrderDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order detail quantity",
        example: 2
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateOrderDetailDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order detail id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDetailDto.prototype, "menu_item", void 0);
class CreateOrderDto {
    table;
    customer;
    is_customer_order;
    order_details;
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Table id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "table", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Customer id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Is a order made by a customer",
        example: true
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateOrderDto.prototype, "is_customer_order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order details",
        type: [CreateOrderDetailDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateOrderDetailDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "order_details", void 0);
//# sourceMappingURL=create-order.dto.js.map