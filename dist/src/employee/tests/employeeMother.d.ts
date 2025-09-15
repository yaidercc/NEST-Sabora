import { Repository } from "typeorm";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { EmployeeRole } from "../entities/employee_role.entity";
import { EmployeeService } from "../employee.service";
import { Employee } from "../entities/employee.entity";
import { UserService } from "src/user/user.service";
export declare class EmployeeMother {
    static dto(employeeInfo?: Partial<CreateEmployeeDto>): CreateEmployeeDto;
    static employeeRolesIds(employeeRepository: Repository<EmployeeRole>): Promise<{}>;
    static createManyEmployees(employeeService: EmployeeService, userService: UserService, quantity: number, employeeRoles: {
        [key: string]: string;
    }): Promise<Employee[]>;
}
