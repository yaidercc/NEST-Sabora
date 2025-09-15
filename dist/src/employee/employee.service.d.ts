import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { DataSource, Repository } from 'typeorm';
import { EmployeeRole } from './entities/employee_role.entity';
import { User } from 'src/user/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { GeneralRole } from 'src/user/entities/general_role.entity';
export declare class EmployeeService {
    private readonly employeeRepository;
    private readonly employeeRoleRepository;
    private readonly userRepository;
    private readonly generalRoleRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(employeeRepository: Repository<Employee>, employeeRoleRepository: Repository<EmployeeRole>, userRepository: Repository<User>, generalRoleRepository: Repository<GeneralRole>, dataSource: DataSource);
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee | undefined>;
    findAll(pagination: PaginationDto): Promise<Employee[]>;
    findOne(term: string): Promise<Employee>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee | undefined>;
    remove(id: string): Promise<import("typeorm").UpdateResult | undefined>;
    removeAllEmployees(): Promise<void>;
}
