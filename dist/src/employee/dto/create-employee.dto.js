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
exports.CreateEmployeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEmployeeDto {
    user_id;
    employee_role_id;
    hiring_date;
}
exports.CreateEmployeeDto = CreateEmployeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Employee role id",
        example: "d3aa5adb-28b4-4686-827d-a2111141e558"
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "employee_role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Hiring date",
        example: "2020-10-10"
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "hiring_date", void 0);
//# sourceMappingURL=create-employee.dto.js.map