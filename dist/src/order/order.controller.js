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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const auth_decorator_1 = require("../user/decorators/auth.decorator");
const roles_1 = require("../common/enums/roles");
const get_user_decorator_1 = require("../user/decorators/get-user.decorator");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
const change_order_status_dto_1 = require("./dto/change-order-status.dto");
const swagger_1 = require("@nestjs/swagger");
const order_entity_1 = require("./entities/order.entity");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    create(createOrderDto, user) {
        return this.orderService.create(createOrderDto, user);
    }
    findAll(pagination, user) {
        return this.orderService.findAll(pagination, user);
    }
    findOne(id, user) {
        return this.orderService.findOne(id, user);
    }
    changeOrderStatus(id, changeOrderStatus, user) {
        return this.orderService.changeOrderStatus(id, changeOrderStatus, user);
    }
    update(id, updateOrderDto, user) {
        return this.orderService.update(id, updateOrderDto, user);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create an order" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "order created", type: order_entity_1.Order }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Get all orders" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Orders", type: [order_entity_1.Order] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, common_1.Get)(),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN, roles_1.GeneralRoles.EMPLOYEE], {}, [roles_1.EmployeeRoles.MANAGER]),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Find one order by a search term" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Order", type: order_entity_1.Order }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Order is not available" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Order not found" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "You have no permission to perform this action" }),
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Change the order status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Order status changed successfully", type: order_entity_1.Order }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Cannot change status/Invalid status transition" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Order not found" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "You have no the appropiate role to perform this action" }),
    (0, common_1.Patch)('change-order-status/:id'),
    (0, auth_decorator_1.Auth)([roles_1.GeneralRoles.ADMIN, roles_1.GeneralRoles.EMPLOYEE], {}, [roles_1.EmployeeRoles.MANAGER, roles_1.EmployeeRoles.COOKER, roles_1.EmployeeRoles.WAITRESS]),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_order_status_dto_1.ChangeOrderStatus, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "changeOrderStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update an order" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Order updated successfully", type: order_entity_1.Order }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Order is not available" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Order not found" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "You have no the appropiate role to perform this action" }),
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)([], {}, [roles_1.EmployeeRoles.MANAGER, roles_1.EmployeeRoles.COOKER, roles_1.EmployeeRoles.WAITRESS]),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "update", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map