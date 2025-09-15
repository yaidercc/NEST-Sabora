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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const employee_role_entity_1 = require("./employee_role.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
let Employee = class Employee {
    id;
    hiring_date;
    is_active;
    user;
    employee_role;
};
exports.Employee = Employee;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Employee id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Employee.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Hiring date",
        example: "2020-10-10"
    }),
    (0, typeorm_1.Column)("date"),
    __metadata("design:type", Date)
], Employee.prototype, "hiring_date", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { default: true, select: false }),
    __metadata("design:type", Boolean)
], Employee.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, user => user.employee),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], Employee.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "employee role",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, typeorm_1.ManyToOne)(() => employee_role_entity_1.EmployeeRole, employee_role => employee_role.employee, { eager: true }),
    __metadata("design:type", employee_role_entity_1.EmployeeRole)
], Employee.prototype, "employee_role", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)("employee")
], Employee);
//# sourceMappingURL=employee.entity.js.map