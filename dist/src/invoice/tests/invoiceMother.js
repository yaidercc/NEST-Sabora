"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceMother = void 0;
const uuid_1 = require("uuid");
const userMother_1 = require("../../user/tests/userMother");
const roles_1 = require("../../common/enums/roles");
const payment_methods_1 = require("../enum/payment_methods");
class InvoiceMother {
    invoiceService;
    userService;
    employeeService;
    employeRoleRepository;
    orderMother;
    constructor(invoiceService, userService, employeeService, employeRoleRepository, orderMother) {
        this.invoiceService = invoiceService;
        this.userService = userService;
        this.employeeService = employeeService;
        this.employeRoleRepository = employeRoleRepository;
        this.orderMother = orderMother;
    }
    static getRandomPaymentMethod() {
        const values = Object.values(payment_methods_1.PaymentMethods);
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
    }
    static dto(InvoiceInfo) {
        return {
            order: InvoiceInfo?.order ?? (0, uuid_1.v4)(),
            service_fee_rate: InvoiceInfo?.service_fee_rate ?? 0.1,
            payment_method: InvoiceInfo?.payment_method ?? InvoiceMother.getRandomPaymentMethod()
        };
    }
    async createManyInvoices(quantity) {
        let invoices = [];
        let orders = await this.orderMother.createManyOrders(quantity);
        let users = await userMother_1.UserMother.createManyUsers(this.userService, quantity);
        const employeeRole = await this.employeRoleRepository.findOneBy({ name: roles_1.EmployeeRoles.CASHIER });
        for (let j = 0; j < users.length; j++) {
            await this.employeeService.create({ user_id: users[j].user.id, employee_role_id: employeeRole?.id, hiring_date: new Date().toISOString() });
            const user = await this.userService.findOne(users[j].user.id);
            users[j] = { user: user, token: "" };
        }
        for (let i = 0; i < quantity; i++) {
            const invoice = await this.invoiceService.create(InvoiceMother.dto({
                order: orders[i].id,
                service_fee_rate: Number((Math.random()).toFixed(1)),
            }), users[i].user);
            if (invoice) {
                invoices.push(invoice);
            }
        }
        return invoices;
    }
}
exports.InvoiceMother = InvoiceMother;
//# sourceMappingURL=invoiceMother.js.map