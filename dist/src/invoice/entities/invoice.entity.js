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
exports.Invoice = void 0;
const order_entity_1 = require("../../order/entities/order.entity");
const typeorm_1 = require("typeorm");
const InvoiceStatus_1 = require("../enum/InvoiceStatus");
const payment_methods_1 = require("../enum/payment_methods");
const swagger_1 = require("@nestjs/swagger");
let Invoice = class Invoice {
    id;
    order;
    service_fee_rate;
    total;
    status;
    payment_method;
    stripe_session_id;
    stripe_payment_intent_id;
};
exports.Invoice = Invoice;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Invoice id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Order",
        type: () => order_entity_1.Order
    }),
    (0, typeorm_1.OneToOne)(() => order_entity_1.Order, { eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", order_entity_1.Order)
], Invoice.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Service fee rate",
        example: 0.2
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0.10 }),
    __metadata("design:type", Number)
], Invoice.prototype, "service_fee_rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Total",
        example: 12.0000
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Invoice.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Invoice status",
        enum: InvoiceStatus_1.InvoiceStatus
    }),
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: InvoiceStatus_1.InvoiceStatus, default: InvoiceStatus_1.InvoiceStatus.PENDING }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Payment method",
        enum: payment_methods_1.PaymentMethods
    }),
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: payment_methods_1.PaymentMethods }),
    __metadata("design:type", String)
], Invoice.prototype, "payment_method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique identifier of the Stripe Checkout session",
        example: "cs_test_a1B2C3D4E5F6G7H8I9J0",
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "stripe_session_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Unique identifier of the Stripe Payment Intent",
        example: "pi_3Nk9WqL8ZsA0tB12345abcdef",
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "stripe_payment_intent_id", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)("invoice")
], Invoice);
//# sourceMappingURL=invoice.entity.js.map