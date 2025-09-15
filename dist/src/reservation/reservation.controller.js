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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const common_1 = require("@nestjs/common");
const reservation_service_1 = require("./reservation.service");
const create_reservation_dto_1 = require("./dto/create-reservation.dto");
const update_reservation_dto_1 = require("./dto/update-reservation.dto");
const auth_decorator_1 = require("../user/decorators/auth.decorator");
const get_user_decorator_1 = require("../user/decorators/get-user.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const swagger_1 = require("@nestjs/swagger");
const reservation_entity_1 = require("./entities/reservation.entity");
let ReservationController = class ReservationController {
    reservationService;
    constructor(reservationService) {
        this.reservationService = reservationService;
    }
    create(createReservationDto) {
        return this.reservationService.create(createReservationDto);
    }
    findOne(id, user) {
        return this.reservationService.findOne(id, user);
    }
    changeReservationStatus(id, updateReservationDto, user) {
        return this.reservationService.changeReservationStatus(id, updateReservationDto, user);
    }
};
exports.ReservationController = ReservationController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a reservation" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "reseravtion created", type: reservation_entity_1.Reservation }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "User not found/Unauthorized" }),
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_dto_1.CreateReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Find one reservation by id" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Reservation", type: reservation_entity_1.Reservation }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "User not found/Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "You have no permission to perform this action" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Reservation not found" }),
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Change reservation status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Reservation status updated successfully", type: reservation_entity_1.Reservation }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "User not found/Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "You have no permission to perform this action" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Reservation not found" }),
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reservation_dto_1.UpdateReservationDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ReservationController.prototype, "changeReservationStatus", null);
exports.ReservationController = ReservationController = __decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('reservation'),
    __metadata("design:paramtypes", [reservation_service_1.ReservationService])
], ReservationController);
//# sourceMappingURL=reservation.controller.js.map