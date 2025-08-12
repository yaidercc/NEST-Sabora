import { Repository } from "typeorm";
import { initialData } from "src/seed/data/seed-data";
import { Chance } from "chance"
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { EmployeeRole } from "../entities/employee_role.entity";
import { EmployeeService } from "../employee.service";
import { Employee } from "../entities/employee.entity";
import { UserService } from "src/user/user.service";
import { UserMother } from "src/user/tests/userMother";
import { EmployeeRoles } from "src/common/enums/roles";

export class EmployeeMother {
    static dto(employeeInfo?: Partial<CreateEmployeeDto>): CreateEmployeeDto {
        return {
            user_id: employeeInfo?.user_id ?? "6c339bfd-c7d2-4bea-9eaf-be4ab0393946",
            employee_role_id: employeeInfo?.employee_role_id ?? "f0f82af0-0842-4873-8304-d618d704ffe9",
            hiring_date: employeeInfo?.hiring_date ?? "2020-10-10",
        }
    }

    static async seedRoles(employeeRepository: Repository<EmployeeRole>) {
        const employeeRoles = initialData.employeeRoles.map((item) => employeeRepository.create(item))
        await employeeRepository.save(employeeRoles)
        const rolesIds = {}
        employeeRoles.forEach((item) => rolesIds[item.name] = item.id)

        return rolesIds
    }



    static async createManyEmployees(employeeService: EmployeeService, userService: UserService, quantity: number, employeeRoles: { [key: string]: string }): Promise<Employee[]> {
        const users = await UserMother.createManyUsers(userService, quantity)
        const randomEmployeeRole = () => Object.values(employeeRoles)[Math.floor(Math.random() * Object.values(employeeRoles).length)]
        let employees: Employee[] = [];

        for (let i = 0; i < quantity; i++) {
            const employee = await employeeService.create(EmployeeMother.dto({
                user_id: users[i].user.id,
                employee_role_id: randomEmployeeRole()
            }))
            if (employee) {
                employees.push(employee)
            }
        }
        return employees
    }

}
