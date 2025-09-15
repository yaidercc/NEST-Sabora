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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_detail_entity_1 = require("./entities/order_detail.entity");
const typeorm_2 = require("@nestjs/typeorm");
const handleErrors_1 = require("../common/helpers/handleErrors");
const table_service_1 = require("../table/table.service");
const menu_item_service_1 = require("../menu_item/menu_item.service");
const uuid_1 = require("uuid");
const isActive_1 = require("../common/helpers/isActive");
const roles_1 = require("../common/enums/roles");
const user_service_1 = require("../user/user.service");
const order_status_1 = require("./enum/order_status");
let OrderService = class OrderService {
    orderRepository;
    orderDetailsRepository;
    tableService;
    menuItemService;
    userService;
    dataSource;
    logger = new common_1.Logger("OrderService");
    constructor(orderRepository, orderDetailsRepository, tableService, menuItemService, userService, dataSource) {
        this.orderRepository = orderRepository;
        this.orderDetailsRepository = orderDetailsRepository;
        this.tableService = tableService;
        this.menuItemService = menuItemService;
        this.userService = userService;
        this.dataSource = dataSource;
    }
    async create(createOrderDto, user) {
        const { table: tableId, order_details, customer: customerId, ...restOrderInfo } = createOrderDto;
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            queryRunner.startTransaction();
            const table = await this.tableService.findOne(tableId);
            const order = queryRunner.manager.create(order_entity_1.Order, {
                ...restOrderInfo,
                table,
                user,
                date: new Date().toISOString()
            });
            if (!createOrderDto.is_customer_order && createOrderDto.customer) {
                const customer = await this.userService.findOne(createOrderDto.customer);
                order.customer = customer;
            }
            else {
                order.customer = user;
            }
            order.is_customer_order = createOrderDto.is_customer_order;
            await queryRunner.manager.save(order);
            let subtotal = 0;
            for (let i = 0; i < order_details.length; i++) {
                const menu_item = await this.menuItemService.findOne(order_details[i].menu_item);
                subtotal += menu_item.price * order_details[i].quantity;
                const order_detail = queryRunner.manager.create(order_detail_entity_1.OrderDetail, {
                    order,
                    quantity: order_details[i].quantity,
                    menu_item
                });
                await queryRunner.manager.save(order_detail);
            }
            await queryRunner.manager.update(order_entity_1.Order, order.id, { subtotal });
            await queryRunner.commitTransaction();
            return this.findOne(order.id, user);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            (0, handleErrors_1.handleException)(error, this.logger);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(paginationDto, user) {
        const { limit = 10, offset = 0 } = paginationDto;
        const isAdmin = user.role.name === roles_1.GeneralRoles.ADMIN;
        const isManager = user.employee?.employee_role.name === roles_1.EmployeeRoles.MANAGER;
        let whereConditions = { is_active: true };
        if (!isAdmin && !isManager) {
            whereConditions = [
                {
                    is_active: true,
                    customer: { id: user.id }
                },
                {
                    is_active: true,
                    user: { id: user.id }
                }
            ];
        }
        return await this.orderRepository.find({
            where: whereConditions,
            relations: [
                'user',
                'user.employee',
                'user.employee.employee_role',
                'user.role',
                'customer',
                'customer.employee',
                'table',
                'order_details',
                'order_details.menu_item'
            ],
            take: limit,
            skip: offset
        });
    }
    async findOne(id, user) {
        let order = null;
        if ((0, uuid_1.validate)(id))
            order = await this.orderRepository.findOneBy({ id: id });
        if (!order)
            throw new common_1.NotFoundException("Order not found");
        const is_active = await (0, isActive_1.isActive)(order.id, this.orderRepository);
        if (!is_active) {
            throw new common_1.BadRequestException("Order is not available");
        }
        const isOwner = order.customer?.id === user.id || order.user.id === user.id;
        const isAdmin = user.role.name === roles_1.GeneralRoles.ADMIN;
        const isManager = user.employee?.employee_role?.name === roles_1.EmployeeRoles.MANAGER;
        const isCashier = user.employee?.employee_role?.name === roles_1.EmployeeRoles.CASHIER;
        if (!isOwner && !isAdmin && !isManager && !isCashier) {
            throw new common_1.ForbiddenException("You have no permission to perform this action");
        }
        return order;
    }
    async update(id, updateOrderDto, user) {
        const { customer: customerId, table: tableId, order_details } = updateOrderDto;
        try {
            const order = await this.findOne(id, user);
            if (!order.is_customer_order && customerId) {
                order.customer = await this.userService.findOne(customerId);
            }
            if (tableId) {
                const table = await this.tableService.findOne(tableId);
                order.table = table;
            }
            if (order_details) {
                let subtotal = 0;
                const newDetails = [];
                for (const dto of order_details) {
                    const menu_item = await this.menuItemService.findOne(dto.menu_item);
                    subtotal += menu_item.price * dto.quantity;
                    const detail = this.orderDetailsRepository.create({
                        order,
                        quantity: dto.quantity,
                        menu_item,
                    });
                    newDetails.push(detail);
                }
                await this.orderDetailsRepository.save(newDetails);
                order.order_details = newDetails;
                order.subtotal = subtotal;
            }
            await this.orderRepository.save(order);
            return this.findOne(id, user);
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    async changeOrderStatus(id, changeOrderStatus, user) {
        const { status } = changeOrderStatus;
        try {
            const order = await this.findOne(id, user);
            this.validateStatusTransaction(order.status, status);
            this.validateStatusPermissions(user, status);
            await this.orderRepository.update(id, { status });
            return this.findOne(id, user);
        }
        catch (error) {
            (0, handleErrors_1.handleException)(error, this.logger);
        }
    }
    validateStatusTransaction(currentStatus, newStatus) {
        const allowedTransitions = {
            [order_status_1.OrderStatus.PENDING]: [order_status_1.OrderStatus.CONFIRMED, order_status_1.OrderStatus.CANCELLED],
            [order_status_1.OrderStatus.CONFIRMED]: [order_status_1.OrderStatus.PREPARING, order_status_1.OrderStatus.CANCELLED],
            [order_status_1.OrderStatus.PREPARING]: [order_status_1.OrderStatus.READY, order_status_1.OrderStatus.CANCELLED],
            [order_status_1.OrderStatus.READY]: [order_status_1.OrderStatus.DELIVERED],
            [order_status_1.OrderStatus.DELIVERED]: [],
            [order_status_1.OrderStatus.CANCELLED]: [],
        };
        if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
            throw new common_1.BadRequestException(`Cannot change status from ${currentStatus} to ${newStatus}`);
        }
    }
    validateStatusPermissions(user, newStatus) {
        const userRole = user.role.name;
        const employeeRole = user.employee?.employee_role?.name;
        const isAdmin = userRole === roles_1.GeneralRoles.ADMIN;
        const isManager = employeeRole === roles_1.EmployeeRoles.MANAGER;
        const isCooker = employeeRole === roles_1.EmployeeRoles.COOKER;
        const isWaitress = employeeRole === roles_1.EmployeeRoles.WAITRESS;
        if (isAdmin || isManager)
            return;
        switch (newStatus) {
            case order_status_1.OrderStatus.CONFIRMED:
                if (!isCooker && !isWaitress) {
                    throw new common_1.ForbiddenException('Only cooks and waitresses can confirm orders');
                }
                break;
            case order_status_1.OrderStatus.PREPARING:
                if (!isCooker) {
                    throw new common_1.ForbiddenException('Only cooks can mark orders as preparing');
                }
                break;
            case order_status_1.OrderStatus.READY:
                if (!isCooker) {
                    throw new common_1.ForbiddenException('Only cooks can mark orders as ready');
                }
                break;
            case order_status_1.OrderStatus.DELIVERED:
                if (!isWaitress) {
                    throw new common_1.ForbiddenException('Only waitresses can mark orders as delivered');
                }
                break;
            case order_status_1.OrderStatus.CANCELLED:
                break;
            default:
                throw new common_1.BadRequestException(`Invalid status transition to ${newStatus}`);
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_2.InjectRepository)(order_detail_entity_1.OrderDetail)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        table_service_1.TableService,
        menu_item_service_1.MenuItemService,
        user_service_1.UserService,
        typeorm_1.DataSource])
], OrderService);
//# sourceMappingURL=order.service.js.map