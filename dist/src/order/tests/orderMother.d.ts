import { CreateOrderDto } from "../dto/create-order.dto";
import { Order } from "../entities/order.entity";
import { OrderService } from "../order.service";
import { MenuItemService } from "src/menu_item/menu_item.service";
import { TableService } from "src/table/table.service";
import { UserService } from "src/user/user.service";
import { EmployeeService } from "src/employee/employee.service";
import { Repository } from "typeorm";
import { EmployeeRole } from "src/employee/entities/employee_role.entity";
export declare class OrderMother {
    private readonly menuItemService;
    private readonly tableService;
    private readonly orderService;
    private readonly userService;
    private readonly employeeService;
    private readonly employeRoleRepository;
    constructor(menuItemService: MenuItemService, tableService: TableService, orderService: OrderService, userService: UserService, employeeService: EmployeeService, employeRoleRepository: Repository<EmployeeRole>);
    static dto(orderInfo?: Partial<CreateOrderDto>): CreateOrderDto;
    createManyOrders(quantity: number): Promise<Order[]>;
}
