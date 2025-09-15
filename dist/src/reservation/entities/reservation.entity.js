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
exports.Reservation = void 0;
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const status_1 = require("../enum/status");
const table_entity_1 = require("../../table/entities/table.entity");
const swagger_1 = require("@nestjs/swagger");
let Reservation = class Reservation {
    id;
    user;
    table;
    date;
    time_start;
    time_end;
    party_size;
    status;
};
exports.Reservation = Reservation;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Reservation id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User",
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.reservation, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Reservation.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Table",
        type: () => table_entity_1.Table,
    }),
    (0, typeorm_1.ManyToOne)(() => table_entity_1.Table, table => table.reservation, { eager: true }),
    __metadata("design:type", table_entity_1.Table)
], Reservation.prototype, "table", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Reservation date",
        example: "2020-12-12"
    }),
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], Reservation.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Reservation time start",
        example: "12:00:00"
    }),
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Reservation.prototype, "time_start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Reservation time end",
        example: "14:00:00"
    }),
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Reservation.prototype, "time_end", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Reservation party size",
        example: 5
    }),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Reservation.prototype, "party_size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Reservation status",
        example: status_1.Status.CONFIRMED
    }),
    (0, typeorm_1.Column)({ type: "simple-enum", enum: status_1.Status }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)("reservation")
], Reservation);
//# sourceMappingURL=reservation.entity.js.map