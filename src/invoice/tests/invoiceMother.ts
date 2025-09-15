import { InvoiceService } from './../invoice.service';
import { Invoice } from './../entities/invoice.entity';

// import { CreateOrderDto } from "../dto/create-order.dto";
import { v4 as uuid } from "uuid"


import { MenuItemMother } from "src/menu_item/tests/menuItemMother";
import { MenuItemService } from "src/menu_item/menu_item.service";
import { TableService } from "src/table/table.service";
import { TableMother } from "src/table/tests/tableMother";
import { UserMother } from "src/user/tests/userMother";
import { UserService } from "src/user/user.service";
import { User } from "src/user/entities/user.entity";
import { EmployeeService } from "src/employee/employee.service";
import { Repository } from "typeorm";
import { EmployeeRole } from "src/employee/entities/employee_role.entity";
import { EmployeeRoles } from "src/common/enums/roles";

import { CreateInvoiceDto } from "../dto/create-invoice.dto";
import { PaymentMethods } from '../enum/payment_methods';
import { OrderMother } from 'src/order/tests/orderMother';

export class InvoiceMother {

    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly userService: UserService,
        private readonly employeeService: EmployeeService,
        private readonly employeRoleRepository: Repository<EmployeeRole>,
        private readonly orderMother: OrderMother

    ) { }

    private static getRandomPaymentMethod(): PaymentMethods {
        const values = Object.values(PaymentMethods);
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex] as PaymentMethods;
    }


    static dto(InvoiceInfo?: Partial<CreateInvoiceDto>): CreateInvoiceDto {
        return {
            order: InvoiceInfo?.order ?? uuid(),
            service_fee_rate: InvoiceInfo?.service_fee_rate ?? 0.1,
            payment_method: InvoiceInfo?.payment_method ?? InvoiceMother.getRandomPaymentMethod()
        }
    }

    async createManyInvoices(quantity: number): Promise<{ invoice: Invoice, checkoutUrl: string }[]> {
        let invoices: { invoice: Invoice, checkoutUrl: string }[] = []
        let orders = await this.orderMother.createManyOrders(quantity)
        let users = await UserMother.createManyUsers(this.userService, quantity);

        const employeeRole = await this.employeRoleRepository.findOneBy({ name: EmployeeRoles.CASHIER })
        for (let j = 0; j < users.length; j++) {
            await this.employeeService.create({ user_id: users[j].user.id!, employee_role_id: employeeRole?.id!, hiring_date: new Date().toISOString() })
            const user = await this.userService.findOne(users[j].user.id!);

            users[j] = { user: user!, token: "" }

        }

        for (let i = 0; i < quantity; i++) {
            const invoice = await this.invoiceService.create(
                InvoiceMother.dto({
                    order: orders[i].id,
                    service_fee_rate: Number((Math.random()).toFixed(1)),
                },
                ), users[i].user as User
            )
            if (invoice) {
                invoices.push(invoice);
            }
        }

        return invoices
    }

}
