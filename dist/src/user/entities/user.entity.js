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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const general_role_entity_1 = require("./general_role.entity");
const swagger_1 = require("@nestjs/swagger");
const employee_entity_1 = require("../../employee/entities/employee.entity");
const reservation_entity_1 = require("../../reservation/entities/reservation.entity");
const order_entity_1 = require("../../order/entities/order.entity");
let User = class User {
    id;
    full_name;
    username;
    email;
    password;
    phone;
    is_active;
    is_temporal_password;
    role;
    employee;
    reservation;
    order;
    beforeInsertOrUpdate() {
        if (this.email)
            this.email = this.email.toLowerCase();
        if (this.full_name)
            this.full_name = this.full_name.toLowerCase();
        if (this.phone)
            this.phone = this.phone.toLowerCase();
    }
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "d3aa5adb-28b4-4686-827d-a2111141e558",
        description: "User ID",
        uniqueItems: true
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Jhon Doe",
        description: "User fullname"
    }),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], User.prototype, "full_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "JhonDoe",
        description: "Username"
    }),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "user@gmail.com",
        description: "User email"
    }),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "user123*",
        description: "User password"
    }),
    (0, typeorm_1.Column)("text", { select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "57356251432",
        description: "User phone"
    }),
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        default: true,
        select: false
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        default: false,
        select: false
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_temporal_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: "61773b80-ee92-438b-bb07-ec9ed32300cd",
            name: "client"
        },
        description: "User role"
    }),
    (0, typeorm_1.ManyToOne)(() => general_role_entity_1.GeneralRole, role => role.user, { eager: true }),
    __metadata("design:type", general_role_entity_1.GeneralRole)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => employee_entity_1.Employee, employee => employee.user, { nullable: true, eager: true }),
    __metadata("design:type", employee_entity_1.Employee)
], User.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, reservation => reservation.user),
    __metadata("design:type", reservation_entity_1.Reservation)
], User.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, order => order.user),
    __metadata("design:type", order_entity_1.Order)
], User.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "beforeInsertOrUpdate", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("user")
], User);
//# sourceMappingURL=user.entity.js.map