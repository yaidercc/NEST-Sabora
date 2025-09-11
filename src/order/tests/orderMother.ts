
import { CreateOrderDto } from "../dto/create-order.dto";
import { v4 as uuid } from "uuid"
import { Order } from "../entities/order.entity";
import { OrderService } from "../order.service";
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

export class OrderMother {

    constructor(
        private readonly menuItemService: MenuItemService,
        private readonly tableService: TableService,
        private readonly orderService: OrderService,
        private readonly userService: UserService,
        private readonly employeeService: EmployeeService,
        private readonly employeRoleRepository: Repository<EmployeeRole>,

    ) { }

    static dto(orderInfo?: Partial<CreateOrderDto>): CreateOrderDto {
        return {
            customer: orderInfo?.customer ?? uuid(),
            table: orderInfo?.table ?? uuid(),
            is_customer_order: orderInfo?.is_customer_order ?? true,
            order_details: orderInfo?.order_details ?? [
                {
                    quantity: 2,
                    menu_item: uuid()
                },
                {
                    quantity: 1,
                    menu_item: uuid()
                }
            ]

        }
    }
    // TODO: REFACT
    async createManyOrders(quantity: number): Promise<Order[]> {
        let orders: Order[] = [];
        const tables = await TableMother.createManyTables(this.tableService, quantity);
        const users = await UserMother.createManyUsers(this.userService, quantity);
        

        const waitressUsers = users.slice(0, Math.min(3, users.length));

        const employeeRole = await this.employeRoleRepository.findOneBy({ name: EmployeeRoles.WAITRESS })
        for (let j = 0; j < waitressUsers.length; j++) {
            await this.employeeService.create({ user_id: waitressUsers[j].user.id!, employee_role_id: employeeRole?.id!, hiring_date: new Date().toISOString() })
            const user = await this.userService.findOne(waitressUsers[j].user.id!);

            waitressUsers[j] = { user: user!, token: "" }

        }
        const customerUsers = users.slice(3);

        for (let i = 0; i < quantity; i++) {
            const menuItems = await MenuItemMother.createManyMenuItems(this.menuItemService, 3);

            let order_details: { menu_item: string, quantity: number }[] = [];
            for (let j = 0; j < menuItems.length; j++) {
                order_details.push({
                    menu_item: menuItems[j].id,
                    quantity: 2
                });
            }

            let orderDto: CreateOrderDto;
            const currentUser = users[i].user;
            let userOrdering: Partial<User> = users[i].user

            // Alternar entre diferentes escenarios
            switch (i % 4) {
                case 0: // Cliente pide su propia orden

                    userOrdering = currentUser;
                    orderDto = OrderMother.dto({
                        table: tables[i].id,
                        customer: currentUser.id, // Mismo usuario
                        is_customer_order: true,
                        order_details
                    });
                    break;

                case 1: // Mesero toma pedido para cliente con cuenta

                    const waitress = waitressUsers[i % waitressUsers.length];
                    const customer = customerUsers[i % customerUsers.length]?.user || currentUser;
                    userOrdering = waitress.user;
                    orderDto = OrderMother.dto({
                        table: tables[i].id,
                        customer: customer.id, // Para el cliente
                        is_customer_order: false,
                        order_details
                    });
                    break;

                case 2: // Mesero toma pedido para cliente SIN cuenta

                    const waitress2 = waitressUsers[i % waitressUsers.length];
                    userOrdering = waitress2.user;
                    orderDto = OrderMother.dto({
                        table: tables[i].id,
                        is_customer_order: false,
                        order_details
                    });
                    break;

                case 3: // Usuario con rol de mesero hace su propia orden (off-duty)

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

            const order = await this.orderService.create(orderDto!, userOrdering as User);
            if (order) {
                orders.push(order);
            }
        }
        return orders;
    }

}
