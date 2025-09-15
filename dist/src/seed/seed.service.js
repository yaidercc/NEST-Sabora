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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const general_role_entity_1 = require("../user/entities/general_role.entity");
const user_service_1 = require("../user/user.service");
const typeorm_2 = require("typeorm");
const seed_data_1 = require("./data/seed-data");
const user_entity_1 = require("../user/entities/user.entity");
const employee_entity_1 = require("../employee/entities/employee.entity");
const employee_service_1 = require("../employee/employee.service");
const employee_role_entity_1 = require("../employee/entities/employee_role.entity");
const table_entity_1 = require("../table/entities/table.entity");
const schedule_entity_1 = require("../reservation/entities/schedule.entity");
const reservation_entity_1 = require("../reservation/entities/reservation.entity");
const menu_item_entity_1 = require("../menu_item/entities/menu_item.entity");
const order_entity_1 = require("../order/entities/order.entity");
const order_detail_entity_1 = require("../order/entities/order_detail.entity");
const invoice_entity_1 = require("../invoice/entities/invoice.entity");
let SeedService = class SeedService {
    generalRoleRepository;
    userRepository;
    userService;
    employeeRepository;
    employeeService;
    employeeRoleRepository;
    tableRepository;
    scheduleRepository;
    reservationRepository;
    menuItemRepository;
    orderRepository;
    orderDetailRepository;
    invoiceRepository;
    constructor(generalRoleRepository, userRepository, userService, employeeRepository, employeeService, employeeRoleRepository, tableRepository, scheduleRepository, reservationRepository, menuItemRepository, orderRepository, orderDetailRepository, invoiceRepository) {
        this.generalRoleRepository = generalRoleRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.employeeRepository = employeeRepository;
        this.employeeService = employeeService;
        this.employeeRoleRepository = employeeRoleRepository;
        this.tableRepository = tableRepository;
        this.scheduleRepository = scheduleRepository;
        this.reservationRepository = reservationRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.invoiceRepository = invoiceRepository;
    }
    async executeSEED() {
        await this.deleteTables();
        const roles = await this.insertGeneralRoles();
        const employeeRole = await this.insertEmployeeRoles();
        const user = await this.insertUser(roles);
        await this.insertEmployee(user, employeeRole);
        await this.insertTables();
        await this.insertSchedules();
        await this.insertMenuItems();
        return "SEED EXECUTED";
    }
    async deleteTables() {
        await this.reservationRepository.createQueryBuilder().delete().where({}).execute();
        await this.orderDetailRepository.createQueryBuilder().delete().where({}).execute();
        await this.invoiceRepository.createQueryBuilder().delete().where({}).execute();
        await this.orderRepository.createQueryBuilder().delete().where({}).execute();
        await this.employeeService.removeAllEmployees();
        await this.userService.removeAllUsers();
        await this.generalRoleRepository.createQueryBuilder().delete().where({}).execute();
        await this.employeeRoleRepository.createQueryBuilder().delete().where({}).execute();
        await this.scheduleRepository.createQueryBuilder().delete().where({}).execute();
        await this.tableRepository.createQueryBuilder().delete().where({}).execute();
        await this.menuItemRepository.createQueryBuilder().delete().where({}).execute();
    }
    async insertUser(role) {
        const users = seed_data_1.initialData.user.map((item, i) => {
            return this.userRepository.create({
                ...item,
                role: role[i]
            });
        });
        await this.userRepository.save(users);
        return users.pop();
    }
    async insertEmployee(user, employeeRole) {
        const employee = this.employeeRepository.create({
            ...seed_data_1.initialData.employee,
            user,
            employee_role: employeeRole
        });
        await this.employeeRepository.save(employee);
        return employee;
    }
    async insertGeneralRoles() {
        const generalRoles = seed_data_1.initialData.generalRoles.map((item) => this.generalRoleRepository.create(item));
        await this.generalRoleRepository.save(generalRoles);
        return generalRoles;
    }
    async insertEmployeeRoles() {
        const employeeRoles = seed_data_1.initialData.employeeRoles.map((item) => this.employeeRoleRepository.create(item));
        await this.employeeRoleRepository.save(employeeRoles);
        return employeeRoles[0];
    }
    async insertTables() {
        const tables = seed_data_1.initialData.tables.map((item) => this.tableRepository.create(item));
        await this.tableRepository.save(tables);
        return tables;
    }
    async insertSchedules() {
        const schedule = seed_data_1.initialData.schedule.map((item) => this.scheduleRepository.create(item));
        await this.scheduleRepository.save(schedule);
        return schedule;
    }
    async insertMenuItems() {
        const menuItem = seed_data_1.initialData.menuItem.map((item) => this.menuItemRepository.create(item));
        await this.menuItemRepository.save(menuItem);
        return menuItem;
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(general_role_entity_1.GeneralRole)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(5, (0, typeorm_1.InjectRepository)(employee_role_entity_1.EmployeeRole)),
    __param(6, (0, typeorm_1.InjectRepository)(table_entity_1.Table)),
    __param(7, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __param(8, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(9, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __param(10, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(11, (0, typeorm_1.InjectRepository)(order_detail_entity_1.OrderDetail)),
    __param(12, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        typeorm_2.Repository,
        employee_service_1.EmployeeService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map