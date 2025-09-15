"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderMother = void 0;
const uuid_1 = require("uuid");
const menuItemMother_1 = require("../../menu_item/tests/menuItemMother");
const tableMother_1 = require("../../table/tests/tableMother");
const userMother_1 = require("../../user/tests/userMother");
const roles_1 = require("../../common/enums/roles");
class OrderMother {
    menuItemService;
    tableService;
    orderService;
    userService;
    employeeService;
    employeRoleRepository;
    constructor(menuItemService, tableService, orderService, userService, employeeService, employeRoleRepository) {
        this.menuItemService = menuItemService;
        this.tableService = tableService;
        this.orderService = orderService;
        this.userService = userService;
        this.employeeService = employeeService;
        this.employeRoleRepository = employeRoleRepository;
    }
    static dto(orderInfo) {
        return {
            customer: orderInfo?.customer ?? (0, uuid_1.v4)(),
            table: orderInfo?.table ?? (0, uuid_1.v4)(),
            is_customer_order: orderInfo?.is_customer_order ?? true,
            order_details: orderInfo?.order_details ?? [
                {
                    quantity: 2,
                    menu_item: (0, uuid_1.v4)()
                },
                {
                    quantity: 1,
                    menu_item: (0, uuid_1.v4)()
                }
            ]
        };
    }
    async createManyOrders(quantity) {
        let orders = [];
        const tables = await tableMother_1.TableMother.createManyTables(this.tableService, quantity);
        const users = await userMother_1.UserMother.createManyUsers(this.userService, quantity);
        const waitressUsers = users.slice(0, Math.min(3, users.length));
        const employeeRole = await this.employeRoleRepository.findOneBy({ name: roles_1.EmployeeRoles.WAITRESS });
        for (let j = 0; j < waitressUsers.length; j++) {
            await this.employeeService.create({ user_id: waitressUsers[j].user.id, employee_role_id: employeeRole?.id, hiring_date: new Date().toISOString() });
            const user = await this.userService.findOne(waitressUsers[j].user.id);
            waitressUsers[j] = { user: user, token: "" };
        }
        const customerUsers = users.slice(3);
        for (let i = 0; i < quantity; i++) {
            const menuItems = await menuItemMother_1.MenuItemMother.createManyMenuItems(this.menuItemService, 3);
            let order_details = [];
            for (let j = 0; j < menuItems.length; j++) {
                order_details.push({
                    menu_item: menuItems[j].id,
                    quantity: 2
                });
            }
            let orderDto;
            const currentUser = users[i].user;
            let userOrdering = users[i].user;
            switch (i % 4) {
                case 0:
                    userOrdering = currentUser;
                    orderDto = OrderMother.dto({
                        table: tables[i].id,
                        customer: currentUser.id,
                        is_customer_order: true,
                        order_details
                    });
                    break;
                case 1:
                    const waitress = waitressUsers[i % waitressUsers.length];
                    const customer = customerUsers[i % customerUsers.length]?.user || currentUser;
                    userOrdering = waitress.user;
                    orderDto = OrderMother.dto({
                        table: tables[i].id,
                        customer: customer.id,
                        is_customer_order: false,
                        order_details
                    });
                    break;
                case 2:
                    const waitress2 = waitressUsers[i % waitressUsers.length];
                    userOrdering = waitress2.user;
                    orderDto = OrderMother.dto({
                        table: tables[i].id,
                        is_customer_order: false,
                        order_details
                    });
                    break;
                case 3:
                    const offDutyWaitress = waitressUsers[i % waitressUsers.length];
                    userOrdering = offDutyWaitress.user;
                    orderDto = OrderMother.dto({
                        table: tables[i].id,
                        customer: offDutyWaitress.user.id,
                        is_customer_order: true,
                        order_details
                    });
                    break;
            }
            const order = await this.orderService.create(orderDto, userOrdering);
            if (order) {
                orders.push(order);
            }
        }
        return orders;
    }
}
exports.OrderMother = OrderMother;
//# sourceMappingURL=orderMother.js.map