import { TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmployeeService } from "src/employee/employee.service";
import { Employee } from "src/employee/entities/employee.entity";
import { EmployeeRole } from "src/employee/entities/employee_role.entity";
import { SeedService } from "src/seed/seed.service";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import * as request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { GeneralRole } from "src/user/entities/general_role.entity";
import { initialData } from "src/seed/data/seed-data";
import { TableService } from "src/table/table.service";
import { Table } from "src/table/entities/table.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { ReservationService } from "src/reservation/reservation.service";
import { MenuItem } from "src/menu_item/entities/menu_item.entity";
import { MenuItemService } from "src/menu_item/menu_item.service";
import { OrderService } from "src/order/order.service";
import { Order } from "src/order/entities/order.entity";
import { OrderDetail } from "src/order/entities/order_detail.entity";

export interface TestServices {
    tableService: TableService;
    userService: UserService;
    seedService: SeedService;
    employeesService: EmployeeService;
    reservationService: ReservationService;
    menuItemService: MenuItemService,
    orderService: OrderService
    
}

export interface TestRepositories {
    tableRepository: Repository<Table>
    userRepository: Repository<User>
    employeeRepository: Repository<Employee>
    employeeRoleRepository: Repository<EmployeeRole>
    generalRoleRepository: Repository<GeneralRole>
    reservationRepository: Repository<Reservation>
    menuItemRepository: Repository<MenuItem>,
    orderRepository: Repository<Order>,
    orderDetailsRepository:  Repository<OrderDetail>
}

export interface AdminLogin {
    user: {
        id: string,
        full_name: string,
        email: string,
        phone: string,
        is_active: boolean,
        role: GeneralRole
    }, token: string
}
export class TestHelpers {
    static getRepositories(module: TestingModule): TestRepositories {
        return {
            tableRepository: module.get<Repository<Table>>(getRepositoryToken(Table)),
            userRepository: module.get<Repository<User>>(getRepositoryToken(User)),
            employeeRepository: module.get<Repository<Employee>>(getRepositoryToken(Employee)),
            employeeRoleRepository: module.get<Repository<EmployeeRole>>(getRepositoryToken(EmployeeRole)),
            generalRoleRepository: module.get<Repository<GeneralRole>>(getRepositoryToken(GeneralRole)),
            reservationRepository: module.get<Repository<Reservation>>(getRepositoryToken(Reservation)),
            menuItemRepository: module.get<Repository<MenuItem>>(getRepositoryToken(MenuItem)),
            orderRepository: module.get<Repository<Order>>(getRepositoryToken(Order)),
            orderDetailsRepository:  module.get<Repository<OrderDetail>>(getRepositoryToken(OrderDetail)),
        }
    }
    static getServices(module: TestingModule): TestServices {
        return {
            tableService: module.get<TableService>(TableService),
            userService: module.get<UserService>(UserService),
            seedService: module.get<SeedService>(SeedService),
            employeesService: module.get<EmployeeService>(EmployeeService),
            reservationService: module.get<ReservationService>(ReservationService),
            menuItemService: module.get<MenuItemService>(MenuItemService),
            orderService: module.get<OrderService>(OrderService),

        }
    }

    static async loginAsAdmin(app: INestApplication): Promise<AdminLogin | undefined> {
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({ username: initialData.user[0].username, password: "Jhondoe123*" });

        return response.body;
    }

    static async setupTestData(seedService: SeedService): Promise<void> {
        await seedService.executeSEED();
    }

}