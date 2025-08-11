import { DataSource, Repository } from "typeorm";
import { EmployeeService } from "../employee.service";
import { Employee } from "../entities/employee.entity";
import { EmployeeRole } from "../entities/employee_role.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { employeeId, mockDataSource, mockEmployeeRepo, mockEmployeeRoleRepo, mockManager } from "./mocks/employee.mock";
import { EmployeeMother } from "./employeeMother";


describe("Unit EmployeeServices tests", () => {
    let employeeService: EmployeeService;
    let employeeRepository: Repository<Employee>
    let employeeRoleRepository: Repository<EmployeeRole>

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                EmployeeService,
                {
                    provide: getRepositoryToken(Employee),
                    useValue: mockEmployeeRepo
                },
                {
                    provide: getRepositoryToken(EmployeeRole),
                    useValue: mockEmployeeRoleRepo
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource
                },
                
            ]
        }).compile()

        employeeService = module.get<EmployeeService>(EmployeeService)
        employeeRepository = module.get<Repository<Employee>>(getRepositoryToken(Employee))
        employeeRoleRepository = module.get<Repository<EmployeeRole>>(getRepositoryToken(EmployeeRole))

    })


    it('should create an employee', async () => {
        const employeeDTO = EmployeeMother.dto()
        const employeeCreated = { ...employeeDTO, id: employeeId }

        mockManager.create.mockReturnValue(employeeCreated)
        mockManager.save.mockReturnValue(employeeCreated)

        const response = await employeeService.create(employeeDTO)

        expect(mockManager.create).toHaveBeenCalled()
        expect(mockManager.save).toHaveBeenCalled()
        expect(response).toMatchObject(employeeCreated)

    });



})