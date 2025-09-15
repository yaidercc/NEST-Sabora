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
exports.EmployeeRole = void 0;
const roles_1 = require("../../common/enums/roles");
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("./employee.entity");
let EmployeeRole = class EmployeeRole {
    id;
    name;
    employee;
};
exports.EmployeeRole = EmployeeRole;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], EmployeeRole.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-enum", enum: roles_1.EmployeeRoles }),
    __metadata("design:type", String)
], EmployeeRole.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_entity_1.Employee, employee => employee.employee_role),
    __metadata("design:type", Array)
], EmployeeRole.prototype, "employee", void 0);
exports.EmployeeRole = EmployeeRole = __decorate([
    (0, typeorm_1.Entity)("employee_role")
], EmployeeRole);
//# sourceMappingURL=employee_role.entity.js.map