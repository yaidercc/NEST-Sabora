"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHelpers = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const employee_service_1 = require("../../employee/employee.service");
const employee_entity_1 = require("../../employee/entities/employee.entity");
const employee_role_entity_1 = require("../../employee/entities/employee_role.entity");
const seed_service_1 = require("../../seed/seed.service");
const user_entity_1 = require("../../user/entities/user.entity");
const user_service_1 = require("../../user/user.service");
const request = require("supertest");
const general_role_entity_1 = require("../../user/entities/general_role.entity");
const seed_data_1 = require("../../seed/data/seed-data");
const table_service_1 = require("../../table/table.service");
const table_entity_1 = require("../../table/entities/table.entity");
const reservation_entity_1 = require("../../reservation/entities/reservation.entity");
const reservation_service_1 = require("../../reservation/reservation.service");
const menu_item_entity_1 = require("../../menu_item/entities/menu_item.entity");
const menu_item_service_1 = require("../../menu_item/menu_item.service");
const order_service_1 = require("../../order/order.service");
const order_entity_1 = require("../../order/entities/order.entity");
const order_detail_entity_1 = require("../../order/entities/order_detail.entity");
const invoice_entity_1 = require("../../invoice/entities/invoice.entity");
const invoice_service_1 = require("../../invoice/invoice.service");
class TestHelpers {
    static getRepositories(module) {
        return {
            tableRepository: module.get((0, typeorm_1.getRepositoryToken)(table_entity_1.Table)),
            userRepository: module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User)),
            employeeRepository: module.get((0, typeorm_1.getRepositoryToken)(employee_entity_1.Employee)),
            employeeRoleRepository: module.get((0, typeorm_1.getRepositoryToken)(employee_role_entity_1.EmployeeRole)),
            generalRoleRepository: module.get((0, typeorm_1.getRepositoryToken)(general_role_entity_1.GeneralRole)),
            reservationRepository: module.get((0, typeorm_1.getRepositoryToken)(reservation_entity_1.Reservation)),
            menuItemRepository: module.get((0, typeorm_1.getRepositoryToken)(menu_item_entity_1.MenuItem)),
            orderRepository: module.get((0, typeorm_1.getRepositoryToken)(order_entity_1.Order)),
            orderDetailsRepository: module.get((0, typeorm_1.getRepositoryToken)(order_detail_entity_1.OrderDetail)),
            invoiceRepository: module.get((0, typeorm_1.getRepositoryToken)(invoice_entity_1.Invoice)),
        };
    }
    static getServices(module) {
        return {
            tableService: module.get(table_service_1.TableService),
            userService: module.get(user_service_1.UserService),
            seedService: module.get(seed_service_1.SeedService),
            employeesService: module.get(employee_service_1.EmployeeService),
            reservationService: module.get(reservation_service_1.ReservationService),
            menuItemService: module.get(menu_item_service_1.MenuItemService),
            orderService: module.get(order_service_1.OrderService),
            invoiceService: module.get(invoice_service_1.InvoiceService),
        };
    }
    static async loginAsAdmin(app) {
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({ username: seed_data_1.initialData.user[0].username, password: "Jhondoe123*" });
        return response.body;
    }
    static async setupTestData(seedService) {
        await seedService.executeSEED();
    }
}
exports.TestHelpers = TestHelpers;
//# sourceMappingURL=test-helpers.js.map