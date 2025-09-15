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
exports.Table = void 0;
const swagger_1 = require("@nestjs/swagger");
const order_entity_1 = require("../../order/entities/order.entity");
const reservation_entity_1 = require("../../reservation/entities/reservation.entity");
const typeorm_1 = require("typeorm");
let Table = class Table {
    id;
    capacity;
    name;
    is_active;
    reservation;
    order;
    beforeInserORUpdate() {
        if (this.name)
            this.name = this.name.toLowerCase();
    }
};
exports.Table = Table;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Table id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Table.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Table capacity",
        example: 3
    }),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Table.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Table name",
        example: "Table 201"
    }),
    (0, typeorm_1.Column)({ length: 40, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Table.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: true, select: false }),
    __metadata("design:type", Boolean)
], Table.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, reservation => reservation.table),
    __metadata("design:type", reservation_entity_1.Reservation)
], Table.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, order => order.table),
    __metadata("design:type", order_entity_1.Order)
], Table.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Table.prototype, "beforeInserORUpdate", null);
exports.Table = Table = __decorate([
    (0, typeorm_1.Entity)("table")
], Table);
//# sourceMappingURL=table.entity.js.map