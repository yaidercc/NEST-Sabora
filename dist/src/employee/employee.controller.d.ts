import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Employee } from './entities/employee.entity';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee | undefined>;
    findAll(pagination: PaginationDto): Promise<Employee[]>;
    findOne(term: string): Promise<Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee | undefined>;
    remove(id: string): Promise<import("typeorm").UpdateResult | undefined>;
}
