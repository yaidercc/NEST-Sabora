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

export class TestHelpers {
    static getRepositories(module: TestingModule) {
        return {
            userRepository: module.get<Repository<User>>(getRepositoryToken(User)),
            employeeRepository: module.get<Repository<Employee>>(getRepositoryToken(Employee)),
            employeeRoleRepository: module.get<Repository<EmployeeRole>>(getRepositoryToken(EmployeeRole)),
        }
    }
    static getServices(module: TestingModule) {
        return {
            userService: module.get<UserService>(UserService),
            seedService: module.get<SeedService>(SeedService),
            employeesService: module.get<EmployeeService>(EmployeeService)

        }
    }

    static async loginAsAdmin(app: INestApplication): Promise<any> {
        const response = await request(app.getHttpServer())
            .post('/user/login')
            .send({
                email: 'admin@admin.com',
                password: 'Abc123456'
            });

        return response.body;
    }

    static async setupTestData(seedService: SeedService): Promise<void> {
        await seedService.executeSEED();
    }

}