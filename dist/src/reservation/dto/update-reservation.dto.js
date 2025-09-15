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
exports.UpdateReservationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const status_1 = require("../enum/status");
const class_validator_1 = require("class-validator");
class UpdateReservationDto {
    status;
}
exports.UpdateReservationDto = UpdateReservationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "reservation status",
        example: status_1.Status.CONFIRMED
    }),
    (0, class_validator_1.ValidateIf)((value) => value !== null && value !== undefined),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.values(status_1.Status)),
    __metadata("design:type", String)
], UpdateReservationDto.prototype, "status", void 0);
//# sourceMappingURL=update-reservation.dto.js.map