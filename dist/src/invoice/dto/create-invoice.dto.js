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
exports.CreateInvoiceDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const payment_methods_1 = require("../enum/payment_methods");
const swagger_1 = require("@nestjs/swagger");
class CreateInvoiceDto {
    order;
    service_fee_rate;
    payment_method;
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Service fee rate",
        example: 0.2
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "service_fee_rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Payment method",
        enum: payment_methods_1.PaymentMethods
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.values(payment_methods_1.PaymentMethods)),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "payment_method", void 0);
//# sourceMappingURL=create-invoice.dto.js.map